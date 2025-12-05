'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  ArrowRight,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RawLead } from "@/utils/types";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'csv' | 'url'>('csv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<{ stage: string; progress: number } | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const handleFileSelect = (file: File) => {
    try {
      setError(null);
      setUrlError(null);
      setShowEmptyState(false);
      
      if (!file) {
        setError('No file selected. Please choose a CSV file.');
        return;
      }
      
      // Check file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Invalid file type. Please upload a valid CSV file.');
        setSelectedFile(null);
        return;
      }
      
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        setError('Your file is too large. Please upload a file under 10MB.');
        setSelectedFile(null);
        return;
      }
      
      if (file.size === 0) {
        setError('The selected file is empty. Please choose a valid CSV file.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
    } catch (err) {
      setError('An error occurred while selecting the file. Please try again.');
      console.error('File selection error:', err);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    } catch (err) {
      setError('An error occurred while reading the file. Please try again.');
      console.error('File input error:', err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      } else {
        setError('No file was dropped. Please drag and drop a CSV file.');
      }
    } catch (err) {
      setError('An error occurred while dropping the file. Please try again.');
      console.error('Drop error:', err);
    }
  };

  const handleDownloadSample = () => {
    try {
      const link = document.createElement('a');
      link.href = '/sample-leads.csv';
      link.download = 'sample-leads.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download sample file. Please try again.');
      console.error('Download error:', err);
    }
  };

  const validateUrl = (urlString: string): boolean => {
    try {
      if (!urlString || !urlString.trim()) {
        setUrlError('Please enter a valid URL.');
        return false;
      }
      
      const urlObj = new URL(urlString.trim());
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must start with http:// or https://');
        return false;
      }
      
      setUrlError(null);
      return true;
    } catch (err) {
      setUrlError('Please enter a valid URL (e.g., https://example.com/leads.csv)');
      return false;
    }
  };

  const handleProcessLeads = async () => {
    // Check for empty state
    if (uploadType === 'csv' && !selectedFile) {
      setShowEmptyState(true);
      setError(null);
      return;
    }
    
    if (uploadType === 'url') {
      if (!url.trim()) {
        setError('No file selected. Please upload a CSV or import from URL.');
        return;
      }
      
      if (!validateUrl(url)) {
        setIsProcessing(false);
        setProgress(null);
        return;
      }
    }

    setIsProcessing(true);
    setError(null);
    setShowEmptyState(false);
    setProgress({ stage: 'Uploading file...', progress: 10 });

    try {
      let rawLeads: RawLead[] = [];

      if (uploadType === 'csv') {
        if (!selectedFile) {
          setError('No file selected. Please upload a CSV or import from URL.');
          setIsProcessing(false);
          setProgress(null);
          return;
        }

        setProgress({ stage: 'Uploading file...', progress: 20 });

        // Upload and parse CSV
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          let errorMessage = 'Failed to upload CSV file.';
          try {
            const errorData = await uploadResponse.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (uploadResponse.status === 413) {
              errorMessage = 'File is too large. Please upload a file under 10MB.';
            } else if (uploadResponse.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            } else {
              errorMessage = `Failed to upload: ${uploadResponse.statusText}`;
            }
          } catch (parseError) {
            if (uploadResponse.status === 413) {
              errorMessage = 'File is too large. Please upload a file under 10MB.';
            } else if (uploadResponse.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            }
          }
          throw new Error(errorMessage);
        }

        setProgress({ stage: 'Parsing leads...', progress: 40 });
        const uploadData = await uploadResponse.json();
        rawLeads = uploadData.leads;
      } else {
        // URL import
        if (!url || !url.trim()) {
          setError('No file selected. Please upload a CSV or import from URL.');
          setIsProcessing(false);
          setProgress(null);
          return;
        }

        setProgress({ stage: 'Fetching data from URL...', progress: 20 });

        const importResponse = await fetch('/api/import-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!importResponse.ok) {
          let errorMessage = 'Failed to import from URL.';
          try {
            const errorData = await importResponse.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (importResponse.status === 404) {
              errorMessage = 'The URL was not found. Please check the URL and try again.';
            } else if (importResponse.status === 403 || importResponse.status === 401) {
              errorMessage = 'Access denied. The URL may require authentication or is not publicly accessible.';
            } else if (importResponse.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            } else {
              errorMessage = `Failed to import: ${importResponse.statusText}`;
            }
          } catch (parseError) {
            if (importResponse.status === 404) {
              errorMessage = 'The URL was not found. Please check the URL and try again.';
            } else if (importResponse.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            }
          }
          throw new Error(errorMessage);
        }

        setProgress({ stage: 'Parsing leads...', progress: 40 });
        const importData = await importResponse.json();
        rawLeads = importData.leads;
      }

      if (!rawLeads || rawLeads.length === 0) {
        setError('No valid leads found in the uploaded data. Please check your file format and try again.');
        setIsProcessing(false);
        setProgress(null);
        return;
      }

      setProgress({ stage: 'Scoring leads with AI...', progress: 60 });

      // Process leads with scoring (check for AI availability)
      const processResponse = await fetch('/api/process-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          leads: rawLeads,
          useAI: false // Can be enabled later via UI toggle
        }),
      });

        if (!processResponse.ok) {
          let errorMessage = 'Failed to process leads.';
          try {
            const errorData = await processResponse.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (processResponse.status >= 500) {
              errorMessage = 'Server error while processing leads. Please try again.';
            } else {
              errorMessage = `Failed to process: ${processResponse.statusText}`;
            }
          } catch (parseError) {
            if (processResponse.status >= 500) {
              errorMessage = 'Server error while processing leads. Please try again.';
            }
          }
          throw new Error(errorMessage);
        }

      setProgress({ stage: 'Finalizing results...', progress: 90 });
      const processData = await processResponse.json();

      // Store results in localStorage to pass to results page
      localStorage.setItem('processedLeads', JSON.stringify(processData));

      setProgress({ stage: 'Complete!', progress: 100 });

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to results page
      router.push('/results');
    } catch (err) {
      let errorMessage = 'An unexpected error occurred while processing leads.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Handle network errors
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
      console.error('Error processing leads:', err);
    }
  };

  const handleRetry = () => {
    setError(null);
    setUrlError(null);
    setShowEmptyState(false);
    setSelectedFile(null);
    setUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="pt-4">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Upload Your Leads</h2>
            <p className="text-lg text-slate-600">Import from CSV or paste a URL to get started</p>
          </div>

          {/* URL Import Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              <button
                onClick={() => {
                  setUploadType('csv');
                  setError(null);
                  setUrlError(null);
                  setShowEmptyState(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'csv'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="inline-block mr-2 h-4 w-4" />
                CSV Upload
              </button>
              <button
                onClick={() => {
                  setUploadType('url');
                  setError(null);
                  setUrlError(null);
                  setShowEmptyState(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'url'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="inline-block mr-2 h-4 w-4" />
                URL Import
              </button>
            </div>
          </div>

          <Card className="shadow-xl rounded-xl">
            <CardContent className="p-8">
              {/* Error Display */}
              {error && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-2">{error}</p>
                    <Button
                      variant="outline"
                      onClick={handleRetry}
                      className="border-red-300 text-red-700 hover:bg-red-100 text-sm"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Upload
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State Card */}
              {showEmptyState && !error && (
                <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      No file selected. Please upload a CSV or import from URL.
                    </p>
                  </div>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && progress && (
                <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-900">{progress.stage}</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadType === 'csv' ? (
                <>
                  {/* Large Drag & Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-slate-500 bg-slate-50 shadow-md'
                        : selectedFile
                        ? 'border-slate-400 bg-slate-50'
                        : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                  >
                    <Upload className={`h-16 w-16 mx-auto mb-6 ${selectedFile ? 'text-slate-600' : 'text-slate-400'}`} />
                    {selectedFile ? (
                      <>
                        <p className="text-lg font-semibold text-slate-900 mb-2">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-slate-700 mb-3">
                          Drag & drop your CSV file here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Supported: CSV, JSON via URL • Max size: 10MB
                        </p>
                      </>
                    )}
                    <Input
                      ref={fileInputRef}
                      id="csv-file-input"
                      name="csvFile"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileInputChange}
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Download Sample CSV Button */}
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={handleDownloadSample}
                      disabled={isProcessing}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download sample-leads.csv
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Input
                      id="url-import-input"
                      name="importUrl"
                      placeholder="https://example.com/leads.json or https://example.com/leads.csv"
                      className={`text-base py-6 rounded-xl ${urlError ? 'border-red-300 focus:border-red-500' : ''}`}
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setUrlError(null);
                        setError(null);
                        if (e.target.value.trim()) {
                          validateUrl(e.target.value);
                        }
                      }}
                      onBlur={() => {
                        if (url.trim()) {
                          validateUrl(url);
                        }
                      }}
                      disabled={isProcessing}
                    />
                    {urlError && (
                      <p className="text-sm text-red-600 mt-2">{urlError}</p>
                    )}
                    <p className="text-sm text-slate-500 mt-3 text-center">
                      Supported: CSV, JSON via URL • Max size: 10MB
                    </p>
                  </div>
                </div>
              )}

              {/* Process Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleProcessLeads}
                  disabled={isProcessing}
                  className="text-xl font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Process Leads <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

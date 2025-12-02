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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RawLead } from "@/utils/types";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'csv' | 'url'>('csv');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<{ stage: string; progress: number } | null>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleProcessLeads = async () => {
    setIsProcessing(true);
    setError(null);
    setProgress({ stage: 'Starting...', progress: 0 });

    try {
      let rawLeads: RawLead[] = [];

      if (uploadType === 'csv') {
        if (!selectedFile) {
          setError('Please select a CSV file');
          setIsProcessing(false);
          setProgress(null);
          return;
        }

        setProgress({ stage: 'Uploading CSV file...', progress: 20 });

        // Upload and parse CSV
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to upload CSV file: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        setProgress({ stage: 'Parsing CSV data...', progress: 40 });
        const uploadData = await uploadResponse.json();
        rawLeads = uploadData.leads;
      } else {
        // URL import
        if (!url || !url.trim()) {
          setError('Please enter a valid URL');
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
          const errorData = await importResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to import from URL: ${importResponse.status} ${importResponse.statusText}`);
        }

        setProgress({ stage: 'Parsing imported data...', progress: 40 });
        const importData = await importResponse.json();
        rawLeads = importData.leads;
      }

      if (rawLeads.length === 0) {
        setError('No valid leads found in the uploaded data');
        setIsProcessing(false);
        setProgress(null);
        return;
      }

      setProgress({ stage: `Processing ${rawLeads.length} leads...`, progress: 60 });

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
        const errorData = await processResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to process leads: ${processResponse.status} ${processResponse.statusText}`);
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
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while processing leads';
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
      console.error('Error processing leads:', err);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Card
                className={`cursor-pointer transition-all ${uploadType === 'csv' ? 'ring-2 ring-slate-900 shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => {
                  setUploadType('csv');
                  setError(null);
                }}
              >
                <CardHeader>
                  <FileText className="h-12 w-12 text-slate-700 mb-3" />
                  <CardTitle className="text-slate-900">CSV Upload</CardTitle>
                  <CardDescription className="text-slate-600">Upload a CSV file with your lead data</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div>
              <Card
                className={`cursor-pointer transition-all ${uploadType === 'url' ? 'ring-2 ring-slate-900 shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => {
                  setUploadType('url');
                  setSelectedFile(null);
                  setError(null);
                }}
              >
                <CardHeader>
                  <LinkIcon className="h-12 w-12 text-slate-700 mb-3" />
                  <CardTitle className="text-slate-900">URL Import</CardTitle>
                  <CardDescription className="text-slate-600">Import leads from a public URL or API</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">
                  {uploadType === 'csv' ? 'Select CSV File' : 'Enter URL'}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {uploadType === 'csv'
                    ? 'Choose a CSV file containing name, company, email, and other lead details'
                    : 'Paste the URL to your lead data source'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {progress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{progress.stage}</span>
                      <span>{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-slate-900 h-full transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadType === 'csv' ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                      dragActive
                        ? 'border-slate-500 bg-slate-50'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    {selectedFile ? (
                      <>
                        <p className="text-slate-900 font-medium mb-2">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
                        <p className="text-sm text-slate-500">Maximum file size: 10MB</p>
                      </>
                    )}
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="https://example.com/leads.json or https://example.com/leads.csv"
                        className="text-base py-6"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isProcessing}
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Supports JSON and CSV formats. URL must be publicly accessible.
                      </p>
                    </div>
                    <Textarea
                      placeholder="Optional: Add any authentication headers or notes here (not yet implemented)"
                      rows={4}
                      disabled
                      className="opacity-50"
                    />
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/')}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleProcessLeads}
                    className="shadow-md"
                    disabled={isProcessing || (uploadType === 'csv' && !selectedFile) || (uploadType === 'url' && !url.trim())}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Process Leads <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}






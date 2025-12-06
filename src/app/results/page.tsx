"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProcessedLead, ProcessLeadsResponse } from "@/utils/types";
import { AlertCircle, Download, Loader2, ArrowUpDown, Filter } from "lucide-react";
import ScoreExplanationSection from "@/components/ScoreExplanationSection";

export default function ResultsPage() {
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";
  function handleNavigateToUpload(e: React.MouseEvent<HTMLButtonElement>) { if (e) e.preventDefault(); if (!isBrowser) return; router.push("/upload"); }
  function handleNavigateToResults(e: React.MouseEvent<HTMLButtonElement>) { if (e) e.preventDefault(); if (!isBrowser) return; router.push("/results"); }
  const [selectedLead, setSelectedLead] = React.useState<ProcessedLead | null>(null);
  const [leads, setLeads] = React.useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = React.useState<ProcessedLead[]>([]);
  const [stats, setStats] = React.useState({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    averageScore: 0,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  const [sortByHighest, setSortByHighest] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  React.useEffect(() => { if (!isBrowser) return; loadLeads(); }, []);

  async function loadLeads() {
    if (!isBrowser) return;
    try {
      const raw = localStorage.getItem("leads");
      if (!raw) { setLeads([]); setLoading(false); return; }
      const parsed = JSON.parse(raw);
      setLeads(Array.isArray(parsed) ? parsed : []);
      setLoading(false);
    } catch (err) {
      setError("Unable to load leads.");
      setLeads([]);
      setLoading(false);
    }
  }

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    if (filteredLeads.length === 0) {
      setError('No leads to export. Please upload leads first.');
      return;
    }
    
    setIsExporting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/export?format=${format}`);
      
      if (!response.ok) {
        let errorMessage = 'Failed to export leads.';
        if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (response.status === 404) {
          errorMessage = 'Export service not available. Please try again later.';
        }
        throw new Error(errorMessage);
      }
      
      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Export file is empty. Please try again.');
      }
      
      if (isBrowser) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      }
    } catch (err) {
      let errorMessage = 'Failed to export leads.';
      
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
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSort = () => {
    setSortByHighest(!sortByHighest);
    const sorted = [...filteredLeads].sort((a, b) => 
      sortByHighest ? a.score - b.score : b.score - a.score
    );
    setFilteredLeads(sorted);
  };

  const handleFilter = (status: 'all' | 'hot' | 'warm' | 'cold') => {
    setStatusFilter(status);
  };

  React.useEffect(() => {
    let filtered = [...leads];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    
    const sorted = filtered.sort((a, b) => b.score - a.score);
    setFilteredLeads(sorted);
  }, [leads, statusFilter]);

  const hotLeads = stats.hot;
  const warmLeads = stats.warm;
  const avgScore = stats.averageScore;

  if (error && leads.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Leads</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push('/upload')}>
                      Upload Leads
                    </Button>
                    <Button variant="outline" onClick={loadLeads}>
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-slate-900 mx-auto" />
              <p className="text-slate-600 mt-4">Loading leads...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No Leads Found</h3>
                  <p className="text-slate-600 mb-6">No leads data available. Please upload leads first.</p>
                  <Button onClick={() => router.push('/upload')}>
                    Upload Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="pt-4">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Lead Analysis Results</h2>
              <p className="text-lg text-slate-600">AI-scored and prioritized leads ready for outreach</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleExport('csv')} 
                variant="outline"
                disabled={isExporting || leads.length === 0}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </>
                )}
              </Button>
              <Button onClick={() => router.push('/upload')} variant="outline">
                Upload More Leads
              </Button>
            </div>
          </div>

          <ScoreExplanationSection />

          {/* Error Banner (non-blocking) */}
          {error && leads.length > 0 && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setError(null)}
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-100 text-sm"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {leads.length === 0 && !loading && !error && (
            <div className="w-full max-w-xl mx-auto bg-gray-50 p-4 rounded-xl shadow-md text-center mb-6">
              <p className="font-semibold">No leads available yet</p>
              <p className="text-sm mt-1">Upload a CSV or import from URL to see results</p>
              <button
                onClick={() => router.push('/upload')}
                className="mt-3 px-4 py-2 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Upload Leads
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div>
              <Card className="shadow-lg border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-700 text-sm font-medium">Hot Leads</CardTitle>
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mt-2">{hotLeads}</div>
                  <CardDescription className="text-slate-600">Score 80+</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div>
              <Card className="shadow-lg border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-700 text-sm font-medium">Warm Leads</CardTitle>
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mt-2">{warmLeads}</div>
                  <CardDescription className="text-slate-600">Score 60-79</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div>
              <Card className="shadow-lg border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-700 text-sm font-medium">Average Score</CardTitle>
                  <div className="text-4xl font-bold text-slate-900 mt-2">{avgScore}</div>
                  <CardDescription className="text-slate-600">Across all leads</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {leads.length > 0 && (
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div>
                      <CardTitle className="text-slate-900">All Leads</CardTitle>
                      <CardDescription className="text-slate-600">Click any row to view detailed information</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={handleSort}
                        className="text-sm"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Sort by {sortByHighest ? 'Lowest' : 'Highest'} Score
                      </Button>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-600" />
                        <select
                          id="status-filter"
                          name="statusFilter"
                          value={statusFilter}
                          onChange={(e) => handleFilter(e.target.value as 'all' | 'hot' | 'warm' | 'cold')}
                          className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option value="all">All Status</option>
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </select>
                      </div>
                      <Button
                        onClick={() => handleExport('csv')}
                        disabled={isExporting || filteredLeads.length === 0}
                        className="text-sm"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="text-slate-700 font-semibold">Name</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Company</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Score</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                              No leads match the selected filter
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLeads.map((lead) => (
                            <TableRow
                              key={lead.id}
                              className="cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <TableCell className="font-medium text-slate-900">{lead.name}</TableCell>
                              <TableCell className="text-slate-700">{lead.company}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="text-lg font-bold text-slate-900">{lead.score}</div>
                                  <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${lead.status === 'hot' ? 'bg-red-500' : lead.status === 'warm' ? 'bg-orange-500' : 'bg-slate-400'}`}
                                      style={{ width: `${lead.score}%` }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                  lead.status === 'hot' ? 'bg-red-100 text-red-700' :
                                  lead.status === 'warm' ? 'bg-orange-100 text-orange-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {lead.status.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">{lead.notes ?? "No explanation available"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl text-slate-900">{selectedLead.name}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  {selectedLead.company} • {selectedLead.industry}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Lead Score</div>
                    <div className="text-3xl font-bold text-slate-900">{selectedLead.score}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-medium ${
                    selectedLead.status === 'hot' ? 'bg-red-100 text-red-700' :
                    selectedLead.status === 'warm' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedLead.status.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">Email</div>
                    <div className="text-slate-900">{selectedLead.email || 'N/A'}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">Company</div>
                    <div className="text-slate-900">{selectedLead.company}</div>
                  </div>

                  {selectedLead.title && (
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">Title</div>
                      <div className="text-slate-900">{selectedLead.title}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">Industry</div>
                    <div className="text-slate-900">{selectedLead.industry}</div>
                  </div>

                  {selectedLead.phone && (
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">Phone</div>
                      <div className="text-slate-900">{selectedLead.phone}</div>
                    </div>
                  )}

                  {selectedLead.website && (
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">Website</div>
                      <div className="text-slate-900">
                        <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedLead.website}
                        </a>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">AI Insights</div>
                    <div className="text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-lg">
                      {selectedLead.notes}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 shadow-md">
                    Start Outreach
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add to Campaign
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}






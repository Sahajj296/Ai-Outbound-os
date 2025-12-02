'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProcessedLead, ProcessLeadsResponse } from "@/utils/types";
import { AlertCircle, Download, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [selectedLead, setSelectedLead] = useState<ProcessedLead | null>(null);
  const [leads, setLeads] = useState<ProcessedLead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    averageScore: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to load from localStorage (for newly processed leads)
      const storedData = localStorage.getItem('processedLeads');
      
      if (storedData) {
        try {
          const data: ProcessLeadsResponse = JSON.parse(storedData);
          
          if (data.success && data.leads && data.leads.length > 0) {
            setLeads(data.leads);
            setStats({
              total: data.total,
              hot: data.hot,
              warm: data.warm,
              cold: data.cold,
              averageScore: data.averageScore,
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Failed to parse localStorage data:', err);
        }
      }
      
      // Fallback: Try to load from database
      try {
        const response = await fetch('/api/leads?stats=true');
        if (response.ok) {
          const statsData = await response.json();
          const leadsResponse = await fetch('/api/leads');
          if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json();
            if (leadsData.leads && leadsData.leads.length > 0) {
              setLeads(leadsData.leads);
              setStats(statsData);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load from database:', err);
      }
      
      // No data found
      setError('No leads data found. Please upload leads first.');
    } catch (err) {
      setError('Failed to load leads data. Please upload leads again.');
      console.error('Error loading leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to export leads');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const hotLeads = stats.hot;
  const warmLeads = stats.warm;
  const avgScore = stats.averageScore;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No Leads Found</h3>
                  <p className="text-slate-600 mb-6">{error}</p>
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

  if (isLoading) {
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

  if (leads.length === 0 && !error) {
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

          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">All Leads</CardTitle>
                <CardDescription className="text-slate-600">Click any row to view detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-slate-700 font-semibold">Name</TableHead>
                        <TableHead className="text-slate-700 font-semibold">Company</TableHead>
                        <TableHead className="text-slate-700 font-semibold">Email</TableHead>
                        <TableHead className="text-slate-700 font-semibold">Industry</TableHead>
                        <TableHead className="text-slate-700 font-semibold">Score</TableHead>
                        <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className="cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <TableCell className="font-medium text-slate-900">{lead.name}</TableCell>
                          <TableCell className="text-slate-700">{lead.company}</TableCell>
                          <TableCell className="text-slate-600">{lead.email || 'N/A'}</TableCell>
                          <TableCell className="text-slate-600">{lead.industry}</TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
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






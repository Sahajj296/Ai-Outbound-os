import { NextRequest, NextResponse } from 'next/server';
import { ProcessedLead } from '@/utils/types';
import { getLeads } from '@/lib/db';

/**
 * Convert leads to CSV format
 */
function leadsToCSV(leads: ProcessedLead[]): string {
  if (leads.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Company',
    'Email',
    'Industry',
    'Title',
    'Phone',
    'Website',
    'Location',
    'Score',
    'Status',
    'Notes'
  ];

  // Escape CSV values (handle commas and quotes)
  const escapeCSV = (value: string | undefined): string => {
    if (!value) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV rows
  const rows = leads.map(lead => [
    escapeCSV(lead.name),
    escapeCSV(lead.company),
    escapeCSV(lead.email),
    escapeCSV(lead.industry),
    escapeCSV(lead.title),
    escapeCSV(lead.phone),
    escapeCSV(lead.website),
    escapeCSV(lead.location),
    String(lead.score),
    lead.status.toUpperCase(),
    escapeCSV(lead.notes)
  ]);

  // Combine headers and rows
  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ];

  return csvLines.join('\n');
}

/**
 * Convert leads to Excel-compatible format (CSV with BOM for Excel)
 */
function leadsToExcel(leads: ProcessedLead[]): string {
  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  return BOM + leadsToCSV(leads);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv'; // csv or excel
    const status = searchParams.get('status') as 'hot' | 'warm' | 'cold' | null;
    
    // Get leads from database
    let leads = await getLeads();
    
    // Filter by status if provided
    if (status) {
      leads = leads.filter(lead => lead.status === status);
    }
    
    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads found to export' },
        { status: 404 }
      );
    }
    
    // Generate CSV content
    const csvContent = format === 'excel' 
      ? leadsToExcel(leads)
      : leadsToCSV(leads);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leads-export-${timestamp}.${format === 'excel' ? 'csv' : 'csv'}`;
    
    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': format === 'excel' 
          ? 'text/csv; charset=utf-8'
          : 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv'; // csv or excel
    
    // Try to get leads from request body
    let leads: ProcessedLead[] = [];
    try {
      const body = await request.json();
      const { leads: providedLeads } = body as { leads?: ProcessedLead[] };
      
      if (providedLeads && Array.isArray(providedLeads) && providedLeads.length > 0) {
        leads = providedLeads;
      }
    } catch (bodyError) {
      // If body parsing fails, continue to database fallback
      console.warn('Could not parse request body, falling back to database:', bodyError);
    }
    
    // If no leads from body, get from database
    if (leads.length === 0) {
      leads = await getLeads();
    }
    
    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads found to export' },
        { status: 404 }
      );
    }
    
    // Generate CSV content
    const csvContent = format === 'excel' 
      ? leadsToExcel(leads)
      : leadsToCSV(leads);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leads-export-${timestamp}.${format === 'excel' ? 'csv' : 'csv'}`;
    
    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': format === 'excel' 
          ? 'text/csv; charset=utf-8'
          : 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { RawLead } from '@/utils/types';

/**
 * Parse CSV content (reuse logic from upload route)
 */
function parseCSV(csvText: string): RawLead[] {
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  const leads: RawLead[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
    
    if (values.every(v => !v)) continue;
    
    const lead: RawLead = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      const normalizedHeader = header.toLowerCase();
      
      if (normalizedHeader.includes('name') && !normalizedHeader.includes('company')) {
        lead.name = value;
      } else if (normalizedHeader.includes('company')) {
        lead.company = value;
      } else if (normalizedHeader.includes('email')) {
        lead.email = value;
      } else if (normalizedHeader.includes('industry')) {
        lead.industry = value;
      } else if (normalizedHeader.includes('phone')) {
        lead.phone = value;
      } else if (normalizedHeader.includes('website') || normalizedHeader.includes('url')) {
        lead.website = value;
      } else if (normalizedHeader.includes('title') || normalizedHeader.includes('role') || normalizedHeader.includes('position')) {
        lead.title = value;
      } else if (normalizedHeader.includes('location') || normalizedHeader.includes('city')) {
        lead.location = value;
      }
      
      lead[header] = value;
    });
    
    if (lead.email || lead.name) {
      leads.push(lead);
    }
  }
  
  return leads;
}

/**
 * Parse JSON data and convert to RawLead format
 */
function parseJSON(jsonData: any): RawLead[] {
  const leads: RawLead[] = [];
  
  // Handle array of leads
  if (Array.isArray(jsonData)) {
    jsonData.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        const lead: RawLead = {};
        
        // Map common field names
        Object.keys(item).forEach((key) => {
          const normalizedKey = key.toLowerCase();
          const value = item[key];
          
          if (normalizedKey.includes('name') && !normalizedKey.includes('company')) {
            lead.name = String(value || '');
          } else if (normalizedKey.includes('company')) {
            lead.company = String(value || '');
          } else if (normalizedKey.includes('email')) {
            lead.email = String(value || '').toLowerCase();
          } else if (normalizedKey.includes('industry')) {
            lead.industry = String(value || '');
          } else if (normalizedKey.includes('phone')) {
            lead.phone = String(value || '');
          } else if (normalizedKey.includes('website') || normalizedKey.includes('url')) {
            lead.website = String(value || '');
          } else if (normalizedKey.includes('title') || normalizedKey.includes('role') || normalizedKey.includes('position')) {
            lead.title = String(value || '');
          } else if (normalizedKey.includes('location') || normalizedKey.includes('city')) {
            lead.location = String(value || '');
          }
          
          lead[key] = value;
        });
        
        if (lead.email || lead.name) {
          leads.push(lead);
        }
      }
    });
  } else if (typeof jsonData === 'object' && jsonData !== null) {
    // Handle object with a 'leads' or 'data' property
    const dataArray = jsonData.leads || jsonData.data || jsonData.results || [jsonData];
    return parseJSON(dataArray);
  }
  
  return leads;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, headers: customHeaders } = body as { 
      url: string; 
      headers?: Record<string, string> 
    };
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are allowed' },
        { status: 400 }
      );
    }
    
    // Fetch data from URL
    const fetchHeaders: HeadersInit = {
      'User-Agent': 'AOOS-Lead-Importer/1.0',
      ...customHeaders,
    };
    
    const response = await fetch(url, {
      headers: fetchHeaders,
      // Timeout after 30 seconds
      signal: AbortSignal.timeout(30000),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Determine content type
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    let rawLeads: RawLead[] = [];
    
    // Parse based on content type
    if (contentType.includes('application/json') || url.endsWith('.json')) {
      try {
        const jsonData = JSON.parse(text);
        rawLeads = parseJSON(jsonData);
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to parse JSON data', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 400 }
        );
      }
    } else if (contentType.includes('text/csv') || contentType.includes('text/plain') || url.endsWith('.csv')) {
      rawLeads = parseCSV(text);
    } else {
      // Try to parse as JSON first, then CSV
      try {
        const jsonData = JSON.parse(text);
        rawLeads = parseJSON(jsonData);
      } catch {
        // If JSON parsing fails, try CSV
        rawLeads = parseCSV(text);
      }
    }
    
    if (rawLeads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in the imported data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      leads: rawLeads,
      count: rawLeads.length
    });
    
  } catch (error) {
    console.error('Error importing from URL:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. The URL took too long to respond.' },
          { status: 408 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to import data from URL', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


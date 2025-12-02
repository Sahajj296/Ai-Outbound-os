import { NextRequest, NextResponse } from 'next/server';
import { RawLead } from '@/utils/types';

/**
 * Parse CSV line handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

/**
 * Parse CSV file content
 */
function parseCSV(csvText: string): RawLead[] {
  // Normalize line endings and split
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  
  // Parse data rows
  const leads: RawLead[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
    
    // Skip empty rows
    if (values.every(v => !v)) continue;
    
    const lead: RawLead = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Normalize header names (case-insensitive)
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
      
      // Store original header mapping
      lead[header] = value;
    });
    
    // Only add leads that have at least an email or name
    if (lead.email || lead.name) {
      leads.push(lead);
    }
  }
  
  return leads;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }
    
    // Read file content
    const text = await file.text();
    
    // Parse CSV
    const rawLeads = parseCSV(text);
    
    if (rawLeads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in CSV file' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      leads: rawLeads,
      count: rawLeads.length
    });
    
  } catch (error) {
    console.error('Error processing CSV upload:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


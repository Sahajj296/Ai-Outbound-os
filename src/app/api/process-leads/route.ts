import { NextRequest, NextResponse } from 'next/server';
import { RawLead, ProcessLeadsResponse, ProcessedLead } from '@/utils/types';
import { processLead, scoreLead, getLeadStatus, generateLeadNotes } from '@/lib/scoring';
import { scoreLeadWithAI, generateAINotes, isOpenAIConfigured } from '@/lib/openai';
import { addLeads } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leads, useAI = false } = body as { 
      leads: RawLead[]; 
      useAI?: boolean 
    };
    
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json<ProcessLeadsResponse>(
        {
          success: false,
          error: 'No leads provided',
          leads: [],
          total: 0,
          hot: 0,
          warm: 0,
          cold: 0,
          averageScore: 0
        },
        { status: 400 }
      );
    }

    // Check if AI scoring is requested and available
    const shouldUseAI = useAI && isOpenAIConfigured();
    
    // Process each lead
    const processedLeads: ProcessedLead[] = [];
    
    for (let i = 0; i < leads.length; i++) {
      const rawLead = leads[i];
      
      // Normalize and clean the data
      const name = (rawLead.name || rawLead['Name'] || rawLead['name'] || `Lead ${i + 1}`).trim();
      const company = (rawLead.company || rawLead['Company'] || rawLead['company'] || 'Unknown Company').trim();
      const email = (rawLead.email || rawLead['Email'] || rawLead['email'] || '').trim().toLowerCase();
      const industry = (rawLead.industry || rawLead['Industry'] || rawLead['industry'] || 'Unknown').trim();
      
      const normalizedLead: RawLead = {
        ...rawLead,
        name,
        company,
        email,
        industry
      };
      
      let score: number;
      let notes: string;
      
      if (shouldUseAI) {
        try {
          // Use AI scoring
          const aiResult = await scoreLeadWithAI(normalizedLead);
          score = aiResult.score;
          notes = generateAINotes(aiResult, normalizedLead);
        } catch (error) {
          // Fallback to basic scoring if AI fails
          console.warn(`AI scoring failed for lead ${i + 1}, using basic scoring:`, error);
          score = scoreLead(normalizedLead);
          notes = generateLeadNotes(normalizedLead, score);
        }
      } else {
        // Use basic scoring
        score = scoreLead(normalizedLead);
        notes = generateLeadNotes(normalizedLead, score);
      }
      
      const status = getLeadStatus(score);
      
      processedLeads.push({
        id: `lead-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        company,
        email,
        score,
        status,
        industry,
        notes,
        phone: rawLead.phone || rawLead['Phone'] || rawLead['phone'],
        website: rawLead.website || rawLead['Website'] || rawLead['website'],
        title: rawLead.title || rawLead['Title'] || rawLead['title'],
        location: rawLead.location || rawLead['Location'] || rawLead['location'],
      });
    }
    
    // Calculate statistics
    const total = processedLeads.length;
    const hot = processedLeads.filter(l => l.status === 'hot').length;
    const warm = processedLeads.filter(l => l.status === 'warm').length;
    const cold = processedLeads.filter(l => l.status === 'cold').length;
    const averageScore = Math.round(
      processedLeads.reduce((sum, lead) => sum + lead.score, 0) / total
    );

    // Save to database (non-blocking)
    try {
      await addLeads(processedLeads);
    } catch (dbError) {
      console.warn('Failed to save leads to database (non-critical):', dbError);
      // Continue even if database save fails
    }
    
    return NextResponse.json<ProcessLeadsResponse>({
      success: true,
      leads: processedLeads,
      total,
      hot,
      warm,
      cold,
      averageScore
    });
    
  } catch (error) {
    console.error('Error processing leads:', error);
    return NextResponse.json<ProcessLeadsResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        leads: [],
        total: 0,
        hot: 0,
        warm: 0,
        cold: 0,
        averageScore: 0
      },
      { status: 500 }
    );
  }
}


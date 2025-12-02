import { NextRequest, NextResponse } from 'next/server';
import { ProcessedLead } from '@/utils/types';
import { 
  getLeads, 
  addLeads, 
  getLeadById, 
  updateLead, 
  deleteLead,
  getStatistics,
  clearLeads
} from '@/lib/db';

// GET - Get all leads or specific lead
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const status = searchParams.get('status') as 'hot' | 'warm' | 'cold' | null;
    const stats = searchParams.get('stats');
    
    if (stats === 'true') {
      const statistics = await getStatistics();
      return NextResponse.json(statistics);
    }
    
    if (id) {
      const lead = await getLeadById(id);
      if (!lead) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(lead);
    }
    
    let leads = await getLeads();
    
    if (status) {
      leads = leads.filter(lead => lead.status === status);
    }
    
    return NextResponse.json({
      success: true,
      leads,
      count: leads.length
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Add new leads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leads } = body as { leads: ProcessedLead[] };
    
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads provided' },
        { status: 400 }
      );
    }
    
    await addLeads(leads);
    
    return NextResponse.json({
      success: true,
      message: `Successfully saved ${leads.length} lead(s)`,
      count: leads.length
    });
    
  } catch (error) {
    console.error('Error saving leads:', error);
    return NextResponse.json(
      { error: 'Failed to save leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update a lead
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as { id: string } & Partial<ProcessedLead>;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    const success = await updateLead(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a lead or clear all
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';
    
    if (clearAll) {
      await clearLeads();
      return NextResponse.json({
        success: true,
        message: 'All leads cleared'
      });
    }
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteLead(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


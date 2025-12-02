import { ProcessedLead } from '@/utils/types';
import { supabase, isSupabaseConfigured, LEADS_TABLE, LeadRow } from './supabase';
import { promises as fs } from 'fs';
import path from 'path';

// Fallback: File-based storage (for local development without Supabase)
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'leads.json');

/**
 * Ensure database directory exists (fallback only)
 */
async function ensureDbDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Convert database row to ProcessedLead
 */
function rowToLead(row: LeadRow): ProcessedLead {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    score: row.score,
    status: row.status,
    industry: row.industry,
    notes: row.notes,
    phone: row.phone || undefined,
    website: row.website || undefined,
    title: row.title || undefined,
    location: row.location || undefined,
  };
}

/**
 * Convert ProcessedLead to database row
 */
function leadToRow(lead: ProcessedLead): LeadRow {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    score: lead.score,
    status: lead.status,
    industry: lead.industry,
    notes: lead.notes,
    phone: lead.phone || null,
    website: lead.website || null,
    title: lead.title || null,
    location: lead.location || null,
  };
}

/**
 * Read leads from database
 */
export async function getLeads(): Promise<ProcessedLead[]> {
  // Use Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LEADS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return (data || []).map(rowToLead);
    } catch (error) {
      console.error('Error fetching leads from Supabase:', error);
      throw error;
    }
  }

  // Fallback to file storage
  try {
    await ensureDbDir();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data) as ProcessedLead[];
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

/**
 * Save leads to database
 */
export async function saveLeads(leads: ProcessedLead[]): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      // Delete all existing leads and insert new ones
      const { error: deleteError } = await supabase
        .from(LEADS_TABLE)
        .delete()
        .neq('id', ''); // Delete all rows

      if (deleteError) {
        console.error('Error clearing leads:', deleteError);
        throw deleteError;
      }

      if (leads.length > 0) {
        const rows = leads.map(leadToRow);
        const { error: insertError } = await supabase
          .from(LEADS_TABLE)
          .insert(rows);

        if (insertError) {
          console.error('Error inserting leads:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error saving leads to Supabase:', error);
      throw new Error('Failed to save leads to database');
    }
    return;
  }

  // Fallback to file storage
  try {
    await ensureDbDir();
    await fs.writeFile(DB_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving leads to database:', error);
    throw new Error('Failed to save leads to database');
  }
}

/**
 * Add new leads to database (append)
 */
export async function addLeads(newLeads: ProcessedLead[]): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const rows = newLeads.map(leadToRow);
      const { error } = await supabase
        .from(LEADS_TABLE)
        .insert(rows);

      if (error) {
        console.error('Error adding leads:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error adding leads to Supabase:', error);
      throw new Error('Failed to add leads to database');
    }
    return;
  }

  // Fallback to file storage
  const existingLeads = await getLeads();
  const allLeads = [...existingLeads, ...newLeads];
  await saveLeads(allLeads);
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string): Promise<ProcessedLead | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LEADS_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching lead:', error);
        throw error;
      }

      return data ? rowToLead(data) : null;
    } catch (error) {
      console.error('Error fetching lead from Supabase:', error);
      return null;
    }
  }

  // Fallback to file storage
  const leads = await getLeads();
  return leads.find(lead => lead.id === id) || null;
}

/**
 * Update a lead
 */
export async function updateLead(id: string, updates: Partial<ProcessedLead>): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const updateRow: Partial<LeadRow> = {};
      
      if (updates.name !== undefined) updateRow.name = updates.name;
      if (updates.company !== undefined) updateRow.company = updates.company;
      if (updates.email !== undefined) updateRow.email = updates.email;
      if (updates.score !== undefined) updateRow.score = updates.score;
      if (updates.status !== undefined) updateRow.status = updates.status;
      if (updates.industry !== undefined) updateRow.industry = updates.industry;
      if (updates.notes !== undefined) updateRow.notes = updates.notes;
      if (updates.phone !== undefined) updateRow.phone = updates.phone || null;
      if (updates.website !== undefined) updateRow.website = updates.website || null;
      if (updates.title !== undefined) updateRow.title = updates.title || null;
      if (updates.location !== undefined) updateRow.location = updates.location || null;

      updateRow.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(LEADS_TABLE)
        .update(updateRow)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error updating lead in Supabase:', error);
      return false;
    }
  }

  // Fallback to file storage
  const leads = await getLeads();
  const index = leads.findIndex(lead => lead.id === id);
  
  if (index === -1) {
    return false;
  }
  
  leads[index] = { ...leads[index], ...updates };
  await saveLeads(leads);
  return true;
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from(LEADS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lead:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting lead from Supabase:', error);
      return false;
    }
  }

  // Fallback to file storage
  const leads = await getLeads();
  const filteredLeads = leads.filter(lead => lead.id !== id);
  
  if (filteredLeads.length === leads.length) {
    return false; // Lead not found
  }
  
  await saveLeads(filteredLeads);
  return true;
}

/**
 * Get leads by status
 */
export async function getLeadsByStatus(status: 'hot' | 'warm' | 'cold'): Promise<ProcessedLead[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LEADS_TABLE)
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads by status:', error);
        throw error;
      }

      return (data || []).map(rowToLead);
    } catch (error) {
      console.error('Error fetching leads by status from Supabase:', error);
      return [];
    }
  }

  // Fallback to file storage
  const leads = await getLeads();
  return leads.filter(lead => lead.status === status);
}

/**
 * Clear all leads
 */
export async function clearLeads(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from(LEADS_TABLE)
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error('Error clearing leads:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error clearing leads from Supabase:', error);
      throw new Error('Failed to clear leads');
    }
    return;
  }

  // Fallback to file storage
  await saveLeads([]);
}

/**
 * Get statistics
 */
export async function getStatistics() {
  const leads = await getLeads();
  const total = leads.length;
  const hot = leads.filter(l => l.status === 'hot').length;
  const warm = leads.filter(l => l.status === 'warm').length;
  const cold = leads.filter(l => l.status === 'cold').length;
  const averageScore = total > 0 
    ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / total)
    : 0;
  
  return {
    total,
    hot,
    warm,
    cold,
    averageScore
  };
}

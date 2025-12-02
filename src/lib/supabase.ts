import { createClient } from '@supabase/supabase-js';
import { ProcessedLead } from '@/utils/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Database operations will fail.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Database table name
 */
export const LEADS_TABLE = 'leads';

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabase;
}

/**
 * Database schema type for leads table
 */
export interface LeadRow {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  industry: string;
  notes: string;
  phone?: string | null;
  website?: string | null;
  title?: string | null;
  location?: string | null;
  created_at?: string;
  updated_at?: string;
}


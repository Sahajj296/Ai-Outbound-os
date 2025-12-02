// Lead data types
export interface RawLead {
  name?: string;
  company?: string;
  email?: string;
  industry?: string;
  phone?: string;
  website?: string;
  title?: string;
  location?: string;
  [key: string]: any; // Allow additional fields from CSV
}

export interface ProcessedLead {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  industry: string;
  notes: string;
  phone?: string;
  website?: string;
  title?: string;
  location?: string;
}

export interface ProcessLeadsResponse {
  success: boolean;
  leads: ProcessedLead[];
  total: number;
  hot: number;
  warm: number;
  cold: number;
  averageScore: number;
  error?: string;
}

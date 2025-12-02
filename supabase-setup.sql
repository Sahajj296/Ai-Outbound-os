-- Supabase Database Setup for AI Outbound OS
-- Run this SQL in your Supabase SQL Editor

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  status TEXT NOT NULL CHECK (status IN ('hot', 'warm', 'cold')),
  industry TEXT NOT NULL,
  notes TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  title TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your auth needs)
-- For now, we'll allow all operations. In production, you might want to restrict this.
CREATE POLICY "Allow all operations on leads"
  ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Add comments to columns for documentation
COMMENT ON TABLE leads IS 'Stores processed leads with scores and insights';
COMMENT ON COLUMN leads.id IS 'Unique identifier for the lead';
COMMENT ON COLUMN leads.score IS 'Lead score from 0-100';
COMMENT ON COLUMN leads.status IS 'Lead status: hot (80+), warm (60-79), cold (<60)';


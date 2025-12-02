import { RawLead, ProcessedLead } from '@/utils/types';

/**
 * Basic lead scoring algorithm
 * Scores leads based on available data quality and completeness
 */
export function scoreLead(lead: RawLead): number {
  let score = 0;
  const factors: string[] = [];

  // Email presence and quality (30 points)
  if (lead.email) {
    score += 20;
    factors.push('Has email address');
    
    // Valid email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(lead.email)) {
      score += 10;
      factors.push('Valid email format');
    }
  }

  // Company information (25 points)
  if (lead.company) {
    score += 15;
    factors.push('Has company name');
    
    // Company name quality (longer names might indicate more established companies)
    if (lead.company.length > 3) {
      score += 10;
    }
  }

  // Name presence (15 points)
  if (lead.name) {
    score += 15;
    factors.push('Has contact name');
  }

  // Industry information (10 points)
  if (lead.industry) {
    score += 10;
    factors.push('Has industry information');
  }

  // Additional contact info (10 points)
  if (lead.phone) {
    score += 5;
    factors.push('Has phone number');
  }
  
  if (lead.website) {
    score += 5;
    factors.push('Has website');
  }

  // Title/role information (10 points)
  if (lead.title) {
    score += 10;
    factors.push('Has job title');
    
    // Higher scores for decision-maker titles
    const decisionMakerKeywords = ['ceo', 'cto', 'cfo', 'president', 'director', 'vp', 'vice president', 'head', 'manager'];
    const titleLower = lead.title.toLowerCase();
    if (decisionMakerKeywords.some(keyword => titleLower.includes(keyword))) {
      score += 5;
      factors.push('Decision-maker title');
    }
  }

  // Ensure score is between 0-100
  score = Math.min(100, Math.max(0, score));

  return score;
}

/**
 * Determine lead status based on score
 */
export function getLeadStatus(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  return 'cold';
}

/**
 * Generate AI-like insights/notes for a lead
 */
export function generateLeadNotes(lead: RawLead, score: number): string {
  const notes: string[] = [];
  
  if (!lead.email) {
    notes.push('Missing email address - may need to find contact information');
  }
  
  if (!lead.company) {
    notes.push('No company information available');
  } else {
    notes.push(`Company: ${lead.company}`);
  }
  
  if (lead.industry) {
    notes.push(`Industry: ${lead.industry}`);
  }
  
  if (lead.title) {
    notes.push(`Role: ${lead.title}`);
  }
  
  if (score >= 80) {
    notes.push('High-quality lead with complete information. Ready for immediate outreach.');
  } else if (score >= 60) {
    notes.push('Good lead with most information available. Consider enrichment before outreach.');
  } else {
    notes.push('Lead needs more information. Consider data enrichment or research before outreach.');
  }
  
  return notes.join('. ') + '.';
}

/**
 * Process and score a single lead
 */
export function processLead(rawLead: RawLead, index: number): ProcessedLead {
  // Normalize and clean the data
  const name = (rawLead.name || rawLead['Name'] || rawLead['name'] || `Lead ${index + 1}`).trim();
  const company = (rawLead.company || rawLead['Company'] || rawLead['company'] || 'Unknown Company').trim();
  const email = (rawLead.email || rawLead['Email'] || rawLead['email'] || '').trim().toLowerCase();
  const industry = (rawLead.industry || rawLead['Industry'] || rawLead['industry'] || 'Unknown').trim();
  
  const score = scoreLead({
    ...rawLead,
    name,
    company,
    email,
    industry
  });
  
  const status = getLeadStatus(score);
  const notes = generateLeadNotes(rawLead, score);
  
  return {
    id: `lead-${index + 1}-${Date.now()}`,
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
  };
}


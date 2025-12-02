import { RawLead, ProcessedLead } from '@/utils/types';

/**
 * OpenAI API integration for AI-powered lead scoring
 */
export interface AIScoringResult {
  score: number;
  reasoning: string;
  insights: string[];
  recommendations: string[];
}

/**
 * Score a lead using OpenAI API
 */
export async function scoreLeadWithAI(lead: RawLead): Promise<AIScoringResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Prepare lead data for AI analysis
  const leadData = {
    name: lead.name || 'Unknown',
    company: lead.company || 'Unknown',
    email: lead.email || 'Not provided',
    industry: lead.industry || 'Unknown',
    title: lead.title || 'Not provided',
    phone: lead.phone || 'Not provided',
    website: lead.website || 'Not provided',
    location: lead.location || 'Not provided',
  };

  const prompt = `You are an expert lead scoring system. Analyze the following lead information and provide a comprehensive score and insights.

Lead Information:
- Name: ${leadData.name}
- Company: ${leadData.company}
- Email: ${leadData.email}
- Industry: ${leadData.industry}
- Title: ${leadData.title}
- Phone: ${leadData.phone}
- Website: ${leadData.website}
- Location: ${leadData.location}

Please provide:
1. A lead score from 0-100 based on:
   - Data completeness and quality
   - Company size indicators (if available)
   - Decision-making authority (based on title)
   - Industry relevance
   - Contact information quality

2. Brief reasoning for the score (2-3 sentences)

3. Key insights about this lead (3-5 bullet points)

4. Recommendations for outreach (2-3 actionable items)

Respond in JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>",
  "insights": ["<insight 1>", "<insight 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are an expert B2B lead scoring system. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent scoring
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Parse JSON response (handle markdown code blocks if present)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : content;
    
    const result = JSON.parse(jsonContent) as AIScoringResult;

    // Validate and normalize score
    result.score = Math.min(100, Math.max(0, Math.round(result.score || 0)));
    
    // Ensure arrays exist
    result.insights = result.insights || [];
    result.recommendations = result.recommendations || [];

    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Generate enhanced notes using AI insights
 */
export function generateAINotes(aiResult: AIScoringResult, lead: RawLead): string {
  const notes: string[] = [];
  
  notes.push(aiResult.reasoning);
  
  if (aiResult.insights.length > 0) {
    notes.push('Key Insights:');
    aiResult.insights.forEach(insight => {
      notes.push(`• ${insight}`);
    });
  }
  
  if (aiResult.recommendations.length > 0) {
    notes.push('Recommendations:');
    aiResult.recommendations.forEach(rec => {
      notes.push(`• ${rec}`);
    });
  }
  
  return notes.join('\n');
}

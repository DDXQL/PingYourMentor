// =============================================================================
// Mentor Analysis Agent
// =============================================================================
// 分析导师信息，提取关键特征用于后续匹配

import { createChatCompletion } from './openai';
import type { MentorAnalysis } from '@/types';

const MENTOR_SYSTEM_PROMPT = `You are an expert academic advisor specializing in analyzing potential mentors/supervisors. Your task is to extract and analyze comprehensive information about a mentor based on the provided text.

Analyze the mentor's:
1. Institution and department
2. Research focus areas
3. Mentoring style and communication preferences
4. Expectations from prospective students
5. Funding availability
6. Lab culture and size
7. Red flags (warning signs)
8. Green flags (positive indicators)

Output a JSON object with the following structure:
{
  "raw": "Original text summary (max 200 chars)",
  "summary": "Brief summary of the mentor (max 100 chars)",
  "name": "Mentor's name if mentioned",
  "institution": "University/Research Institution name",
  "department": "Department or School name",
  "title": "Academic title (Prof, Assoc Prof, etc.)",
  "researchFocus": [
    {
      "area": "Research area name",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "description": "Brief description of this research focus"
    }
  ],
  "mentorStyle": {
    "communication": "How they prefer to communicate",
    "supervision": "Supervision approach",
    "collaboration": "Collaboration style"
  },
  "expectations": {
    "academic": ["Academic requirement 1", "..."],
    "practical": ["Practical requirement 1", "..."],
    "personality": ["Personality trait expected 1", "..."]
  },
  "funding": {
    "hasFunding": true/false,
    "details": "Details about funding if available",
    "typicalAmount": "Typical funding amount if mentioned"
  },
  "labInfo": {
    "size": "Small (<5), Medium (5-15), Large (>15)",
    "culture": "Lab culture description",
    "publicationsPerYear": approximate number,
    "internationalCollaboration": true/false
  },
  "redFlags": ["Warning sign 1", "..."],
  "greenFlags": ["Positive indicator 1", "..."]
}

Be critical and thorough. If certain information is not available in the text, indicate "Not specified" for that field.`;

const MENTOR_USER_PROMPT = `Analyze the following mentor information and extract structured data:

---
{MENTOR_TEXT}
---

Return ONLY the JSON object, no additional text.`;

export async function mentorAnalysis(mentorText: string): Promise<MentorAnalysis> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: MENTOR_SYSTEM_PROMPT },
    { role: 'user', content: MENTOR_USER_PROMPT.replace('{MENTOR_TEXT}', mentorText) },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  console.log('[Mentor Agent] RAW RESPONSE:', response);

  if (!response) {
    throw new Error('Failed to analyze mentor information');
  }

  try {
    const parsed = JSON.parse(response);
    return {
      raw: parsed.raw || mentorText.slice(0, 200),
      summary: parsed.summary || 'Mentor analysis completed',
      name: parsed.name,
      institution: parsed.institution || 'Not specified',
      department: parsed.department || 'Not specified',
      title: parsed.title || 'Not specified',
      researchFocus: parsed.researchFocus || [],
      mentorStyle: parsed.mentorStyle || {
        communication: 'Not specified',
        supervision: 'Not specified',
        collaboration: 'Not specified',
      },
      expectations: parsed.expectations || {
        academic: [],
        practical: [],
        personality: [],
      },
      funding: parsed.funding || { hasFunding: false },
      labInfo: parsed.labInfo || {
        size: 'Not specified',
        culture: 'Not specified',
        publicationsPerYear: 0,
        internationalCollaboration: false,
      },
      redFlags: parsed.redFlags || [],
      greenFlags: parsed.greenFlags || [],
    };
  } catch (error) {
    console.error('Failed to parse mentor analysis:', error);
    throw new Error('Failed to parse mentor analysis result');
  }
}

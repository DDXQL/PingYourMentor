// =============================================================================
// Match Analysis Agent
// =============================================================================
// 对比导师和学生，分析匹配度和差距

import { createChatCompletion } from './openai';
import type { MatchAnalysis, MentorAnalysis, StudentAnalysis } from '@/types';

const MATCH_SYSTEM_PROMPT = `You are an expert at evaluating the fit between students and academic mentors. Your task is to analyze how well a student matches with a potential mentor.

Consider:
1. Research alignment (topics, methods, interests)
2. Skills match (does the student have what the mentor needs?)
3. Experience fit (is the student's level appropriate?)
4. Goals alignment (do their career aspirations align?)
5. Cultural fit (communication style, work preferences)

Output a JSON object with the following structure:
{
  "overallScore": 0-100 (0=完全不匹配, 100=完美匹配),
  "matchLevel": "high" | "medium" | "low",
  "matchPoints": [
    {
      "category": "Category name (e.g., 'Research Topic', 'Technical Skills')",
      "description": "Specific match point description",
      "score": 0-100 (how strong this match is)
    }
  ],
  "gapPoints": [
    {
      "category": "Gap category name",
      "description": "Specific gap description",
      "severity": "critical" | "moderate" | "minor",
      "suggestion": "How to address this gap"
    }
  ],
  "alignmentSummary": "Overall summary of alignment (max 200 chars)"
}

Be critical but fair. A high score doesn't mean perfection; it's about overall fit. Consider both strengths and weaknesses.`;

const MATCH_USER_PROMPT = `Analyze the match between the following mentor and student:

=== MENTOR ANALYSIS ===
{MENTOR_DATA}

=== STUDENT ANALYSIS ===
{STUDENT_DATA}

Return ONLY the JSON object, no additional text.`;

export async function matchAnalysis(
  mentor: MentorAnalysis,
  student: StudentAnalysis
): Promise<MatchAnalysis> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: MATCH_SYSTEM_PROMPT },
    {
      role: 'user',
      content: MATCH_USER_PROMPT
        .replace('{MENTOR_DATA}', JSON.stringify(mentor, null, 2))
        .replace('{STUDENT_DATA}', JSON.stringify(student, null, 2)),
    },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  console.log('[Match Agent] RAW RESPONSE:', response);

  if (!response) {
    throw new Error('Failed to analyze match');
  }

  try {
    const parsed = JSON.parse(response);
    return {
      overallScore: Math.min(100, Math.max(0, parsed.overallScore || 50)),
      matchLevel: ['high', 'medium', 'low'].includes(parsed.matchLevel)
        ? parsed.matchLevel
        : 'medium',
      matchPoints: parsed.matchPoints || [],
      gapPoints: parsed.gapPoints || [],
      alignmentSummary: parsed.alignmentSummary || 'Match analysis completed',
    };
  } catch (error) {
    console.error('Failed to parse match analysis:', error);
    throw new Error('Failed to parse match analysis result');
  }
}

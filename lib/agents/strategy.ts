// =============================================================================
// Strategy Agent
// =============================================================================
// 生成个性化的联系策略

import { createChatCompletion } from './openai';
import type { Strategy, MentorAnalysis, StudentAnalysis, MatchAnalysis, RiskAnalysis } from '@/types';

const STRATEGY_SYSTEM_PROMPT = `You are an expert at crafting outreach strategies for academic mentorship. Your task is to develop a personalized strategy for a student to contact a potential mentor.

Your strategy should include:
1. Recommended email style (formal/semi-formal/casual)
2. Tone to use
3. Key points to include
4. Points to avoid
5. Opening strategy (hook)
6. Follow-up approach

Output a JSON object with the following structure:
{
  "recommendedStyle": "formal" | "semi-formal" | "casual",
  "tone": "enthusiastic" | "professional" | "curious" | "confident",
  "mustInclude": ["Must include point 1", "..."],
  "shouldInclude": ["Should include point 1", "..."],
  "avoid": ["Point to avoid 1", "..."],
  "openingStrategy": {
    "hookType": "Type of hook (e.g., 'Research-based', 'Question-based', 'Compliment-based')",
    "example": "Example opening sentence"
  },
  "followUpStrategy": {
    "timing": "When to follow up (e.g., '1 week after initial email')",
    "approach": "How to follow up",
    "maxFollowUps": number
  },
  "strategySummary": "Overall strategy summary (max 200 chars)"
}

Be specific and actionable. The strategy should maximize the chances of getting a positive response.`;

const STRATEGY_USER_PROMPT = `Develop an outreach strategy based on the following analysis:

=== MATCH ANALYSIS ===
{MATCH_DATA}

=== MENTOR PROFILE ===
{MENTOR_DATA}

=== STUDENT PROFILE ===
{STUDENT_DATA}

=== RISK ANALYSIS ===
{RISK_DATA}

Return ONLY the JSON object, no additional text.`;

export async function strategyGeneration(
  mentor: MentorAnalysis,
  student: StudentAnalysis,
  match: MatchAnalysis,
  risk: RiskAnalysis
): Promise<Strategy> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: STRATEGY_SYSTEM_PROMPT },
    {
      role: 'user',
      content: STRATEGY_USER_PROMPT
        .replace('{MATCH_DATA}', JSON.stringify(match, null, 2))
        .replace('{MENTOR_DATA}', JSON.stringify(mentor, null, 2))
        .replace('{STUDENT_DATA}', JSON.stringify(student, null, 2))
        .replace('{RISK_DATA}', JSON.stringify(risk, null, 2)),
    },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  console.log('[Strategy Agent] RAW RESPONSE:', response);

  if (!response) {
    throw new Error('Failed to generate strategy');
  }

  try {
    const parsed = JSON.parse(response);
    return {
      recommendedStyle: ['formal', 'semi-formal', 'casual'].includes(parsed.recommendedStyle)
        ? parsed.recommendedStyle
        : 'formal',
      tone: ['enthusiastic', 'professional', 'curious', 'confident'].includes(parsed.tone)
        ? parsed.tone
        : 'professional',
      mustInclude: parsed.mustInclude || [],
      shouldInclude: parsed.shouldInclude || [],
      avoid: parsed.avoid || [],
      openingStrategy: parsed.openingStrategy || {
        hookType: 'Research-based',
        example: 'I am particularly interested in your work on...',
      },
      followUpStrategy: parsed.followUpStrategy || {
        timing: '1 week after initial email',
        approach: 'Send a polite follow-up',
        maxFollowUps: 2,
      },
      strategySummary: parsed.strategySummary || 'Strategy generation completed',
    };
  } catch (error) {
    console.error('Failed to parse strategy:', error);
    throw new Error('Failed to parse strategy result');
  }
}

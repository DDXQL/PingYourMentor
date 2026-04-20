// =============================================================================
// Risk Analysis Agent
// =============================================================================
// 识别联系导师的潜在风险

import { createChatCompletion } from './openai';
import type { RiskAnalysis, MentorAnalysis, StudentAnalysis, MatchAnalysis } from '@/types';

const RISK_SYSTEM_PROMPT = `You are an expert at identifying risks and red flags in academic mentor relationships. Your task is to analyze potential risks when a student reaches out to a mentor.

Consider these risk categories:
1. Academic risks (unrealistic expectations, funding issues)
2. Personal risks (work-life balance, mental health)
3. Professional risks (career advancement, reputation)
4. Financial risks (cost of application, living expenses)
5. Communication risks (misalignment in expectations)

For each risk:
- Assess severity (high/medium/low)
- Explain the risk
- Provide mitigation strategies

Output a JSON object with the following structure:
{
  "risks": [
    {
      "category": "Risk category (e.g., 'Funding Risk')",
      "level": "high" | "medium" | "low",
      "description": "Detailed risk description",
      "mitigation": "How to mitigate this risk"
    }
  ],
  "overallRiskLevel": "high" | "medium" | "low",
  "riskSummary": "Overall risk summary (max 200 chars)",
  "dealBreakers": ["Deal breaker 1", "..."] or []
}

Deal breakers are risks that are so significant they should strongly discourage reaching out. Be thorough but avoid being overly alarmist.`;

const RISK_USER_PROMPT = `Analyze potential risks in the following mentor-student match:

=== MATCH ANALYSIS ===
{MATCH_DATA}

=== MENTOR INFO ===
{MENTOR_DATA}

=== STUDENT INFO ===
{STUDENT_DATA}

Return ONLY the JSON object, no additional text.`;

export async function riskAnalysis(
  mentor: MentorAnalysis,
  student: StudentAnalysis,
  match: MatchAnalysis
): Promise<RiskAnalysis> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: RISK_SYSTEM_PROMPT },
    {
      role: 'user',
      content: RISK_USER_PROMPT
        .replace('{MATCH_DATA}', JSON.stringify(match, null, 2))
        .replace('{MENTOR_DATA}', JSON.stringify(mentor, null, 2))
        .replace('{STUDENT_DATA}', JSON.stringify(student, null, 2)),
    },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  if (!response) {
    throw new Error('Failed to analyze risks');
  }

  try {
    const parsed = JSON.parse(response);
    return {
      risks: parsed.risks || [],
      overallRiskLevel: ['high', 'medium', 'low'].includes(parsed.overallRiskLevel)
        ? parsed.overallRiskLevel
        : 'medium',
      riskSummary: parsed.riskSummary || 'Risk analysis completed',
      dealBreakers: parsed.dealBreakers || [],
    };
  } catch (error) {
    console.error('Failed to parse risk analysis:', error);
    throw new Error('Failed to parse risk analysis result');
  }
}

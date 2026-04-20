// =============================================================================
// Email Agent
// =============================================================================
// 生成高质量的套磁邮件

import { createChatCompletion } from './openai';
import type { EmailDraft, Strategy, MentorAnalysis, StudentAnalysis } from '@/types';

const EMAIL_SYSTEM_PROMPT = `You are an expert at writing professional academic outreach emails. Your task is to generate a high-quality, personalized email for a student to contact a potential mentor.

The email should:
1. Be concise (200-300 words for body)
2. Show genuine interest in the mentor's research
3. Highlight relevant qualifications
4. Be professional but not stiff
5. Include a clear call to action
6. Avoid common mistakes (generic greetings, excessive flattery, spelling errors)

Output a JSON object with the following structure:
{
  "subject": "Email subject line",
  "greeting": "Greeting (e.g., 'Dear Professor [Name],')",
  "introduction": "Brief introduction paragraph (2-3 sentences)",
  "body": "Main body paragraphs (3-4 paragraphs covering research interest, qualifications, and fit)",
  "closing": "Closing paragraph with call to action and signature",
  "fullEmail": "Complete email with all parts combined in proper format",
  "estimatedLength": "Short/Medium/Long",
  "keyPoints": ["Key point covered 1", "Key point covered 2", "..."]
}

Write in English unless the mentor's profile suggests otherwise. Use placeholders like [Professor's Name] if specific info is not available.`;

const EMAIL_USER_PROMPT = `Generate a personalized outreach email based on the following information:

=== STRATEGY ===
{STRATEGY_DATA}

=== MENTOR PROFILE ===
{MENTOR_DATA}

=== STUDENT PROFILE ===
{STUDENT_DATA}

Return ONLY the JSON object, no additional text.`;

export async function emailGeneration(
  mentor: MentorAnalysis,
  student: StudentAnalysis,
  strategy: Strategy
): Promise<EmailDraft> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: EMAIL_SYSTEM_PROMPT },
    {
      role: 'user',
      content: EMAIL_USER_PROMPT
        .replace('{STRATEGY_DATA}', JSON.stringify(strategy, null, 2))
        .replace('{MENTOR_DATA}', JSON.stringify(mentor, null, 2))
        .replace('{STUDENT_DATA}', JSON.stringify(student, null, 2)),
    },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  if (!response) {
    throw new Error('Failed to generate email');
  }

  try {
    const parsed = JSON.parse(response);
    const fullEmail = [
      parsed.subject ? `Subject: ${parsed.subject}` : '',
      parsed.greeting || '',
      '',
      parsed.introduction || '',
      '',
      parsed.body || '',
      '',
      parsed.closing || '',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      subject: parsed.subject || 'Inquiry About Research Opportunities',
      greeting: parsed.greeting || 'Dear Professor,',
      introduction: parsed.introduction || '',
      body: parsed.body || '',
      closing: parsed.closing || '',
      fullEmail: parsed.fullEmail || fullEmail,
      estimatedLength: parsed.estimatedLength || 'Medium',
      keyPoints: parsed.keyPoints || [],
    };
  } catch (error) {
    console.error('Failed to parse email draft:', error);
    throw new Error('Failed to parse email draft result');
  }
}

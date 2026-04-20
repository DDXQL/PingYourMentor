// =============================================================================
// Refine Email API - AI润色邮件
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/lib/agents/openai';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Missing email content' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional email writing assistant specializing in academic cold emails.

Your task is to rewrite the given email to be more professional, concise, and polite. Return ONLY the improved email as JSON.

Requirements:
- Keep it concise (150-250 words)
- Use formal but warm tone
- Remove any template-like phrases
- Be specific and personal to the context
- Maintain all key information from the original
- Return ONLY the improved email, no explanations`;

    const userPrompt = `Please improve the following email and return it as JSON:

${body.email}

Return the improved email in JSON format with "subject" and "body" fields.`;

    const response = await createChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { type: 'json_object' }
    );

    if (!response) {
      throw new Error('Refine email returned empty');
    }

    let refined;
    try {
      refined = JSON.parse(response);
    } catch {
      refined = { body: response };
    }

    return NextResponse.json({
      success: true,
      data: refined,
    });
  } catch (error) {
    console.error('[Refine Email] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Refine failed' },
      { status: 500 }
    );
  }
}

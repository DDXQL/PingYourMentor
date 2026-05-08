// =============================================================================
// Refine Email API - AI润色邮件
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/lib/agents/openai';
import debug from '@/lib/debug';

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

    const isChineseEmail = /[\u4e00-\u9fa5]/.test(body.email);

    const systemPrompt = isChineseEmail
      ? `你是一位专业的留学套磁邮件写作助手。

你的任务是将给定的邮件润色得更加专业、简洁、礼貌。

要求：
- 保持简洁（150-250字左右）
- 使用正式但友好的语气
- 去除模板化表达
- 保持个人化和针对性
- 保留原文关键信息
- 只返回润色后的邮件内容，不要解释`

      : `You are a professional academic cold email writing assistant.

Your task is to rewrite the given email to be more professional, concise, and polite.

Requirements:
- Keep it concise (150-250 words)
- Use formal but warm tone
- Remove any template-like phrases
- Be specific and personal to the context
- Maintain all key information from the original
- Return ONLY the improved email, no explanations`;

    const userPrompt = isChineseEmail
      ? `请润色以下邮件：

${body.email}

请以JSON格式返回润色后的邮件，包含 "subject" 和 "body" 字段。`
      : `Please improve the following email and return it as JSON:

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
    } catch (parseError) {
      debug.error('[Refine Email] JSON parse error. Raw response:', response);
      const bodyMatch = response.match(/"body"\s*:\s*"([^"]*)"/);
      const subjectMatch = response.match(/"subject"\s*:\s*"([^"]*)"/);
      refined = {
        body: bodyMatch ? bodyMatch[1] : response,
        subject: subjectMatch ? subjectMatch[1] : '',
      };
    }

    return NextResponse.json({
      success: true,
      data: refined,
    });
  } catch (error) {
    debug.error('[Refine Email] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Refine failed' },
      { status: 500 }
    );
  }
}

// =============================================================================
// Regenerate Email API Route
// =============================================================================
// 仅重新生成邮件，不重新运行所有 Agent

import { NextRequest, NextResponse } from 'next/server';
import { emailGeneration } from '@/lib/agents';
import type { EmailDraft, AnalyzeResponse } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.mentor || !body.student || !body.strategy) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: 'Missing required data for email generation' },
        { status: 400 }
      );
    }

    const email: EmailDraft = await emailGeneration(
      body.mentor,
      body.student,
      body.strategy
    );

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      data: email as any,
    });
  } catch (error) {
    console.error('Email regeneration error:', error);
    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to regenerate email',
      },
      { status: 500 }
    );
  }
}

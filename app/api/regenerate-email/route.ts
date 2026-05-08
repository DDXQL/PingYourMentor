// =============================================================================
// Regenerate Email API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { emailAgent, profileAgent, decisionAgent } from '@/lib/agents';
import debug from '@/lib/debug';

export const runtime = 'nodejs';

interface RegenerateRequest {
  mentorText: string;
  resumeText: string;
  strategy?: {
    tone: '学术' | '工程' | '简洁';
    must: string[];
    avoid: string[];
    core: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RegenerateRequest = await request.json();

    if (!body.mentorText || !body.resumeText) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    let strategy = body.strategy;
    if (!strategy) {
      const profile = await profileAgent(body.mentorText, body.resumeText);
      const decision = await decisionAgent(profile);
      strategy = {
        tone: decision.strategy?.tone || '简洁',
        must: decision.strategy?.must || [],
        avoid: decision.strategy?.avoid || [],
        core: decision.strategy?.core || '突出匹配点',
      };
    }

    const email = await emailAgent(
      { fields: [], orientation: '不明确', requirements: [], risk: '' },
      { type: '混合', strengths: [], weaknesses: [], highlights: [] },
      strategy
    );

    return NextResponse.json({
      success: true,
      data: email,
    });
  } catch (error) {
    debug.error('[Regenerate Email] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to regenerate email',
      },
      { status: 500 }
    );
  }
}

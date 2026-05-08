// =============================================================================
// Analysis API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { profileAgent, decisionAgent, emailAgent } from '@/lib/agents';
import { saveAnalysis } from '@/lib/db';
import debug from '@/lib/debug';

export const runtime = 'nodejs';

function validateDecision(decision: any) {
  return {
    score: typeof decision.score === 'number' ? Math.max(0, Math.min(100, decision.score)) : 50,
    decision: ['推荐', '谨慎', '不推荐'].includes(decision.decision) ? decision.decision : '谨慎',
    summary: typeof decision.summary === 'string' ? decision.summary : '分析完成',
    match: {
      pros: Array.isArray(decision.match?.pros) ? decision.match.pros : [],
      cons: Array.isArray(decision.match?.cons) ? decision.match.cons : [],
    },
    risks: Array.isArray(decision.risks) ? decision.risks.map((r: any) => ({
      level: ['高', '中', '低'].includes(r.level) ? r.level : '中',
      text: typeof r.text === 'string' ? r.text : '风险提示',
    })) : [],
    strategy: {
      tone: ['学术', '工程', '简洁'].includes(decision.strategy?.tone) ? decision.strategy.tone : '简洁',
      must: Array.isArray(decision.strategy?.must) ? decision.strategy.must : [],
      avoid: Array.isArray(decision.strategy?.avoid) ? decision.strategy.avoid : [],
      core: typeof decision.strategy?.core === 'string' ? decision.strategy.core : '突出匹配点',
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.mentorText || !body.resumeText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: mentorText and resumeText' },
        { status: 400 }
      );
    }

    if (body.mentorText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Mentor text is too short. Please provide more detailed information.' },
        { status: 400 }
      );
    }

    if (body.resumeText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Resume text is too short. Please provide more detailed information.' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    debug.log('[Analysis] Starting...');

    debug.log('[Analysis] Step 1: Profile Agent...');
    const profile = await profileAgent(body.mentorText, body.resumeText);

    debug.log('[Analysis] Step 2: Decision Agent...');
    const decision = await decisionAgent(profile);

    const validatedDecision = validateDecision(decision);

    debug.log('[Analysis] Step 3: Email Agent...');
    const email = await emailAgent(profile.mentor, profile.student, validatedDecision.strategy);

    const processingTime = Date.now() - startTime;
    debug.log(`[Analysis] Completed in ${processingTime}ms`);

    const fullResult = {
      ...validatedDecision,
      email,
      generatedAt: new Date().toISOString(),
    };

    const resultId = await saveAnalysis({
      mentorText: body.mentorText,
      resumeText: body.resumeText,
      result: fullResult,
    });

    if (resultId) {
      debug.log(`[Analysis] Saved with ID: ${resultId}`);
    }

    return NextResponse.json({
      success: true,
      data: fullResult,
      resultId,
    });
  } catch (error) {
    debug.error('[Analysis] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}

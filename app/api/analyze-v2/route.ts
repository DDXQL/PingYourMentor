// =============================================================================
// v1.5 Analysis API Route
// =============================================================================
// 精简架构：3次调用，直接适配UI

import { NextRequest, NextResponse } from 'next/server';
import { profileAgent, decisionAgent, emailAgent } from '@/lib/agents';

export const runtime = 'edge';

// 验证决策数据
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
    console.log('[v1.5] Starting analysis...');

    // Step 1: 基础画像
    console.log('[v1.5] Step 1: Profile Agent...');
    const profile = await profileAgent(body.mentorText, body.resumeText);
    console.log('[v1.5] Profile result:', JSON.stringify(profile));

    // Step 2: 决策分析
    console.log('[v1.5] Step 2: Decision Agent...');
    const decision = await decisionAgent(profile);
    console.log('[v1.5] Decision result:', JSON.stringify(decision));

    // 验证决策数据
    const validatedDecision = validateDecision(decision);

    // 验证决策数据
    const validatedDecision = validateDecision(decision);
    console.log('[v1.5] Validated decision:', JSON.stringify(validatedDecision));

    // Step 3: 邮件生成
    console.log('[v1.5] Step 3: Email Agent...');
    const email = await emailAgent(profile.mentor, profile.student, validatedDecision.strategy);
    console.log('[v1.5] Email result:', JSON.stringify(email));

    const processingTime = Date.now() - startTime;
    console.log(`[v1.5] Analysis completed in ${processingTime}ms`);

    // 直接返回适配前端的结构
    return NextResponse.json({
      success: true,
      data: {
        ...validatedDecision,
        email,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[v1.5] Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}

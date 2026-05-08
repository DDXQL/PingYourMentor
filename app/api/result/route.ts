// =============================================================================
// Result API Route - 获取单条分析记录
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisById } from '@/lib/db';
import debug from '@/lib/debug';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    const analysis = await getAnalysisById(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        mentorText: analysis.mentor_text,
        resumeText: analysis.resume_text,
        result: analysis.result_json,
        mentorName: analysis.mentor_name,
        studentName: analysis.student_name,
        matchScore: analysis.match_score,
        recommendation: analysis.recommendation,
        createdAt: analysis.created_at,
      },
    });
  } catch (error) {
    debug.error('[Result API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

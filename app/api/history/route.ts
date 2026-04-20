// =============================================================================
// Analysis History API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getRecentAnalyses, getAnalysisById } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (id) {
      const analysis = await getAnalysisById(id);
      if (!analysis) {
        return NextResponse.json(
          { success: false, error: 'Analysis not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: analysis });
    }

    const analyses = await getRecentAnalyses(limit, offset);
    return NextResponse.json({ success: true, data: analyses });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

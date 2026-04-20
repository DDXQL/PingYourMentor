// =============================================================================
// Main Analysis API Route
// =============================================================================
// 串联所有 Agent，生成完整的分析结果

import { NextRequest, NextResponse } from 'next/server';
import {
  mentorAnalysis,
  studentAnalysis,
  matchAnalysis,
  riskAnalysis,
  strategyGeneration,
  emailGeneration,
} from '@/lib/agents';
import { saveAnalysis } from '@/lib/db';
import type { AnalyzeRequest, AnalyzeResponse, AnalysisResult, Recommendation } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.mentorText || !body.resumeText) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: 'Missing required fields: mentorText and resumeText' },
        { status: 400 }
      );
    }

    if (body.mentorText.length < 50) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: 'Mentor text is too short. Please provide more detailed information.' },
        { status: 400 }
      );
    }

    if (body.resumeText.length < 50) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: 'Resume text is too short. Please provide more detailed information.' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    const mentor = await mentorAnalysis(body.mentorText);

    const student = await studentAnalysis(body.resumeText);

    const match = await matchAnalysis(mentor, student);

    const risk = await riskAnalysis(mentor, student, match);

    const strategy = await strategyGeneration(mentor, student, match, risk);

    const email = await emailGeneration(mentor, student, strategy);

    const recommendation = determineRecommendation(match, risk);

    const overallSummary = generateOverallSummary(mentor, student, match, risk, recommendation);

    const result: AnalysisResult = {
      mentor,
      student,
      match,
      risk,
      strategy,
      email,
      recommendation,
      overallSummary,
      generatedAt: new Date().toISOString(),
    };

    saveAnalysis({
      mentorText: body.mentorText,
      resumeText: body.resumeText,
      result,
      mentorName: mentor.name,
      studentName: student.name,
    }).catch((err) => console.error('Failed to save analysis:', err));

    const processingTime = Date.now() - startTime;
    console.log(`Analysis completed in ${processingTime}ms`);

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}

function determineRecommendation(
  match: { overallScore: number },
  risk: { overallRiskLevel: string; dealBreakers: string[] }
): Recommendation {
  if (risk.dealBreakers.length > 0) {
    return 'not_recommended';
  }

  if (match.overallScore >= 70 && risk.overallRiskLevel === 'low') {
    return 'highly_recommended';
  }

  if (match.overallScore >= 50 && risk.overallRiskLevel !== 'high') {
    return 'caution';
  }

  return 'not_recommended';
}

function generateOverallSummary(
  mentor: { name?: string; institution: string; title: string },
  student: { name?: string; academicBackground: { degree: string; major: string } },
  match: { overallScore: number; alignmentSummary: string },
  risk: { overallRiskLevel: string; riskSummary: string },
  recommendation: Recommendation
): string {
  const mentorName = mentor.name || '该导师';
  const studentName = student.name || '你';
  const degree = student.academicBackground.degree;

  const recommendationText = {
    highly_recommended: '强烈推荐联系',
    caution: '建议谨慎联系',
    not_recommended: '不建议联系',
  }[recommendation];

  return `${studentName}的背景与${mentorName}的研究方向存在${
    match.overallScore >= 70 ? '较高' : match.overallScore >= 50 ? '一定' : '较低'
  }的匹配度。${recommendationText}。`;
}

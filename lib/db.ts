// =============================================================================
// Database Operations
// =============================================================================

import { supabaseAdmin } from './supabase';
import type { AnalysisResult } from '@/types';

export interface SaveAnalysisParams {
  mentorText: string;
  resumeText: string;
  result: AnalysisResult;
  mentorName?: string;
  studentName?: string;
}

export interface RecentAnalysis {
  id: string;
  mentor_name: string | null;
  student_name: string | null;
  match_score: number | null;
  recommendation: string | null;
  created_at: string;
}

export interface FullAnalysisRecord {
  id: string;
  mentor_text: string;
  resume_text: string;
  result_json: AnalysisResult;
  mentor_name: string | null;
  student_name: string | null;
  match_score: number | null;
  recommendation: string | null;
  created_at: string;
}

export async function saveAnalysis(params: SaveAnalysisParams): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not configured');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('save_analysis', {
      p_mentor_text: params.mentorText,
      p_resume_text: params.resumeText,
      p_result_json: params.result as any,
      p_mentor_name: params.mentorName || null,
      p_student_name: params.studentName || null,
      p_match_score: params.result.match?.overallScore || null,
      p_recommendation: params.result.recommendation || null,
    });

    if (error) {
      console.error('Failed to save analysis:', error);
      return null;
    }

    return data as string;
  } catch (error) {
    console.error('Failed to save analysis:', error);
    return null;
  }
}

export async function getRecentAnalyses(
  limit: number = 10,
  offset: number = 0
): Promise<RecentAnalysis[]> {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not configured');
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('get_recent_analyses', {
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error('Failed to get recent analyses:', error);
      return [];
    }

    return (data || []) as RecentAnalysis[];
  } catch (error) {
    console.error('Failed to get recent analyses:', error);
    return [];
  }
}

export async function getAnalysisById(id: string): Promise<FullAnalysisRecord | null> {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not configured');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('get_analysis_by_id', {
      p_id: id,
    });

    if (error) {
      console.error('Failed to get analysis by id:', error);
      return null;
    }

    const records = data as FullAnalysisRecord[];
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Failed to get analysis by id:', error);
    return null;
  }
}

-- =============================================================================
-- PingYourMentor Database Schema
-- =============================================================================
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Table: analysis_history
-- =============================================================================
-- Stores all analysis results for history and reference

CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_text TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    result_json JSONB NOT NULL,
    mentor_name VARCHAR(255),
    student_name VARCHAR(255),
    match_score INTEGER,
    recommendation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_match_score ON analysis_history(match_score);

-- =============================================================================
-- Table: user_sessions (optional - for future user auth)
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analysis history
CREATE POLICY "Users can view own analysis" ON analysis_history
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND user_id = auth.uid()
    );

-- Policy: Users can insert their own analysis
CREATE POLICY "Users can insert own analysis" ON analysis_history
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND user_id = auth.uid()
    );

-- Policy: Allow anonymous inserts for MVP (remove in production)
CREATE POLICY "Allow anonymous inserts" ON analysis_history
    FOR INSERT WITH CHECK (true);

-- Policy: Allow public read access for MVP (restrict in production)
CREATE POLICY "Allow public read" ON analysis_history
    FOR SELECT USING (true);

-- =============================================================================
-- Function: Save Analysis Result
-- =============================================================================

CREATE OR REPLACE FUNCTION save_analysis(
    p_mentor_text TEXT,
    p_resume_text TEXT,
    p_result_json JSONB,
    p_mentor_name VARCHAR(255) DEFAULT NULL,
    p_student_name VARCHAR(255) DEFAULT NULL,
    p_match_score INTEGER DEFAULT NULL,
    p_recommendation VARCHAR(50) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO analysis_history (
        mentor_text,
        resume_text,
        result_json,
        mentor_name,
        student_name,
        match_score,
        recommendation
    ) VALUES (
        p_mentor_text,
        p_resume_text,
        p_result_json,
        p_mentor_name,
        p_student_name,
        p_match_score,
        p_recommendation
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Function: Get Recent Analyses
-- =============================================================================

CREATE OR REPLACE FUNCTION get_recent_analyses(
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    mentor_name VARCHAR(255),
    student_name VARCHAR(255),
    match_score INTEGER,
    recommendation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        h.id,
        h.mentor_name,
        h.student_name,
        h.match_score,
        h.recommendation,
        h.created_at
    FROM analysis_history h
    ORDER BY h.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Function: Get Analysis by ID
-- =============================================================================

CREATE OR REPLACE FUNCTION get_analysis_by_id(p_id UUID)
RETURNS TABLE (
    id UUID,
    mentor_text TEXT,
    resume_text TEXT,
    result_json JSONB,
    mentor_name VARCHAR(255),
    student_name VARCHAR(255),
    match_score INTEGER,
    recommendation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        h.id,
        h.mentor_text,
        h.resume_text,
        h.result_json,
        h.mentor_name,
        h.student_name,
        h.match_score,
        h.recommendation,
        h.created_at
    FROM analysis_history h
    WHERE h.id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Cleanup: Auto-delete old records (optional)
-- =============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_analyses(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM analysis_history
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

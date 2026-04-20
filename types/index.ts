// =============================================================================
// PingYourMentor - v1.5 Type Definitions
// =============================================================================

// ============================================================================
// v1.5 精简结构 (3次调用)
// ============================================================================

export interface ProfileMentor {
  fields: string[];
  orientation: '科研' | '工程' | '混合' | '不明确';
  requirements: string[];
  risk: string;
}

export interface ProfileStudent {
  type: '工程' | '科研' | '混合';
  strengths: string[];
  weaknesses: string[];
  highlights: string[];
}

export interface Risk {
  level: '高' | '中' | '低';
  text: string;
}

export interface Match {
  pros: string[];
  cons: string[];
}

export interface Strategy {
  tone: '学术' | '工程' | '简洁';
  must: string[];
  avoid: string[];
  core: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  chineseEmail?: {
    subject: string;
    body: string;
  };
}

export type DecisionType = '推荐' | '谨慎' | '不推荐';

export interface AnalysisResult {
  score: number;
  decision: DecisionType;
  summary: string;
  match: Match;
  risks: Risk[];
  strategy: Strategy;
  email: EmailDraft;
  generatedAt: string;
}

export interface AnalyzeRequest {
  mentorText: string;
  resumeText: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

// ============================================================================
// v1 架构类型 (保留兼容)
// ============================================================================

export type MatchLevel = 'high' | 'medium' | 'low';
export type RiskLevel = 'high' | 'medium' | 'low';
export type Recommendation = 'highly_recommended' | 'caution' | 'not_recommended';

export interface BaseAnalysis {
  raw: string;
  summary: string;
}

export interface ResearchFocus {
  area: string;
  keywords: string[];
  description: string;
}

export interface MentorStyle {
  communication: string;
  supervision: string;
  collaboration: string;
}

export interface MentorExpectation {
  academic: string[];
  practical: string[];
  personality: string[];
}

export interface FundingInfo {
  hasFunding: boolean;
  details?: string;
  typicalAmount?: string;
}

export interface LabInfo {
  size: string;
  culture: string;
  publicationsPerYear: number;
  internationalCollaboration: boolean;
}

export interface MentorAnalysis extends BaseAnalysis {
  name?: string;
  institution: string;
  department: string;
  title: string;
  researchFocus: ResearchFocus[];
  mentorStyle: MentorStyle;
  expectations: MentorExpectation;
  funding: FundingInfo;
  labInfo: LabInfo;
  redFlags: string[];
  greenFlags: string[];
}

export interface AcademicBackground {
  degree: string;
  major: string;
  institution: string;
  gpa?: string;
  relevantCourses: string[];
}

export interface ResearchExperience {
  title: string;
  lab?: string;
  duration: string;
  publications?: string[];
  skills: string[];
}

export interface SkillSet {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface StudentAnalysis extends BaseAnalysis {
  name?: string;
  academicBackground: AcademicBackground;
  researchExperience: ResearchExperience[];
  skillSet: SkillSet;
  careerGoals: string;
  motivation: string;
  uniqueStrengths: string[];
}

export interface MatchPoint {
  category: string;
  description: string;
  score: number;
}

export interface GapPoint {
  category: string;
  description: string;
  severity: 'critical' | 'moderate' | 'minor';
  suggestion: string;
}

export interface MatchAnalysis {
  overallScore: number;
  matchLevel: MatchLevel;
  matchPoints: MatchPoint[];
  gapPoints: GapPoint[];
  alignmentSummary: string;
}

export interface RiskAnalysis {
  risks: Risk[];
  overallRiskLevel: RiskLevel;
  riskSummary: string;
  dealBreakers: string[];
}

export interface StrategyPoint {
  type: 'must_include' | 'should_include' | 'avoid';
  content: string;
}

export interface OpeningStrategy {
  hookType: string;
  example: string;
}

export interface FollowUpStrategy {
  timing: string;
  approach: string;
  maxFollowUps: number;
}

export interface StrategyV1 {
  recommendedStyle: 'formal' | 'semi-formal' | 'casual';
  tone: 'enthusiastic' | 'professional' | 'curious' | 'confident';
  mustInclude: string[];
  shouldInclude: string[];
  avoid: string[];
  openingStrategy: OpeningStrategy;
  followUpStrategy: FollowUpStrategy;
  strategySummary: string;
}

export interface EmailDraftV1 {
  subject: string;
  greeting: string;
  introduction: string;
  body: string;
  closing: string;
  fullEmail: string;
  estimatedLength: string;
  keyPoints: string[];
}

export interface AnalysisResultV1 {
  mentor: MentorAnalysis;
  student: StudentAnalysis;
  match: MatchAnalysis;
  risk: RiskAnalysis;
  strategy: StrategyV1;
  email: EmailDraftV1;
  recommendation: Recommendation;
  overallSummary: string;
  generatedAt: string;
}

// ============================================================================
// Database Types
// ============================================================================

export interface AnalysisHistory {
  id: string;
  mentor_text: string;
  resume_text: string;
  result_json: AnalysisResult;
  created_at: string;
}

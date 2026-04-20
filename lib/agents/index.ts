// =============================================================================
// Agent Index - Export all agents
// =============================================================================

// v1.5 精简架构 (3次调用)
export { profileAgent } from './profile';
export { decisionAgent } from './decision';
export { emailAgent } from './email-v2';

// v1 架构 (6次调用，保留兼容)
export { mentorAnalysis } from './mentor';
export { studentAnalysis } from './student';
export { matchAnalysis } from './match';
export { riskAnalysis } from './risk';
export { strategyGeneration } from './strategy';
export { emailGeneration } from './email';

export { createChatCompletion, openai, MODEL, MAX_TOKENS, TEMPERATURE } from './openai';

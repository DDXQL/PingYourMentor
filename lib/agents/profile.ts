// =============================================================================
// Profile Agent - Agent 1: 基础画像
// =============================================================================
// 提取导师和学生用于决策的核心信息

import { createChatCompletion } from './openai';

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

export interface Profile {
  mentor: ProfileMentor;
  student: ProfileStudent;
}

export async function profileAgent(mentorText: string, resumeText: string): Promise<Profile> {
  const systemPrompt = `你是一个研究生申请分析助手。

任务：基于输入的导师信息和学生简历，提取"用于决策"的核心信息。

要求：
- 所有输出必须使用中文
- 严禁编造信息（没有就写"不明确"）
- 只保留"影响是否联系导师"的信息
- 输出必须是 JSON，不要任何解释`;

  const userPrompt = `导师信息：
${mentorText}

学生简历：
${resumeText}`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { type: 'json_object' }
  );

  if (!response) {
    throw new Error('Profile agent 返回为空');
  }

  try {
    return JSON.parse(response) as Profile;
  } catch {
    throw new Error('Profile agent 返回格式错误: ' + response);
  }
}

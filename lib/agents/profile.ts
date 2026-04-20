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

输出格式（必须严格遵循）：
{
  "mentor": {
    "fields": ["研究领域1", "研究领域2"],
    "orientation": "科研/工程/混合/不明确",
    "requirements": ["要求1", "要求2"],
    "risk": "导师风险描述"
  },
  "student": {
    "type": "工程/科研/混合",
    "strengths": ["优势1", "优势2"],
    "weaknesses": ["劣势1"],
    "highlights": ["亮点1", "亮点2"]
  }
}

要求：
- 所有输出必须使用中文
- 严禁编造信息（没有就写"不明确"或空数组）
- 只保留"影响是否联系导师"的信息
- 必须输出完整的 mentor 和 student 对象`;

  const userPrompt = `导师信息：
${mentorText}

学生简历：
${resumeText}

请严格按照上述JSON格式输出，mentor和student字段都必须存在。`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { type: 'json_object' }
  );

  console.log('[Profile Agent] RAW RESPONSE:', response);

  if (!response) {
    throw new Error('Profile agent 返回为空');
  }

  try {
    const parsed = JSON.parse(response);
    
    // 确保返回正确的结构
    if (!parsed.mentor || !parsed.student) {
      console.error('[Profile Agent] Missing mentor or student in response:', parsed);
      throw new Error('Profile agent 返回缺少 mentor 或 student 字段');
    }
    
    return parsed as Profile;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Profile agent 返回格式错误: ' + response);
    }
    throw error;
  }
}

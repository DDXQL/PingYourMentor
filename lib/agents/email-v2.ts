// =============================================================================
// Email Agent - Agent 3: 邮件生成
// =============================================================================
// 基于策略生成真实、非模板化的套磁邮件

import { createChatCompletion } from './openai';
import type { ProfileMentor, ProfileStudent } from './profile';
import type { Strategy } from './decision';

export interface EmailDraft {
  subject: string;
  body: string;
}

export async function emailAgent(
  mentor: ProfileMentor,
  student: ProfileStudent,
  strategy: Strategy
): Promise<EmailDraft> {
  const systemPrompt = `你是一个研究生套磁邮件写作助手。

任务：基于策略生成一封"真实、非模板化"的套磁邮件。

输出格式（必须严格遵循）：
{
  "subject": "邮件主题，简洁明了",
  "body": "邮件正文内容"
}

要求：
- 邮件正文使用英文
- 长度控制在 150-250 词
- 必须具体，不能模板化
- 禁止使用：
  * "I am very interested"
  * 空泛自我介绍
  * "I am writing to inquire about"
- 必须体现：
  * 学生与导师的具体匹配点
  * 至少一个研究关键词
- subject 不要包含 "PhD" 或 "Admission" 等常见词`;

  const userPrompt = `导师画像：
${JSON.stringify(mentor, null, 2)}

学生画像：
${JSON.stringify(student, null, 2)}

邮件策略：
- 语气风格：${strategy.tone}
- 必须包含：${strategy.must.join(', ')}
- 避免提及：${strategy.avoid.join(', ')}
- 核心策略：${strategy.core}

请基于以上信息，生成一封真实的套磁邮件。`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { type: 'json_object' }
  );

  if (!response) {
    throw new Error('Email agent 返回为空');
  }

  console.log('[Email Agent] Raw response:', response);

  try {
    return JSON.parse(response) as EmailDraft;
  } catch {
    throw new Error('Email agent 返回格式错误: ' + response);
  }
}

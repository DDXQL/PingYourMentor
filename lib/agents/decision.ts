// =============================================================================
// Decision Agent - Agent 2: 决策分析核心
// =============================================================================
// 基于画像给出是否联系导师的决策建议

import { createChatCompletion } from './openai';
import type { Profile } from './profile';

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

export interface Decision {
  score: number;
  decision: '推荐' | '谨慎' | '不推荐';
  summary: string;
  match: Match;
  risks: Risk[];
  strategy: Strategy;
}

export async function decisionAgent(profile: Profile): Promise<Decision> {
  const systemPrompt = `你是一个"套磁决策顾问"。

任务：基于导师画像和学生画像，给出是否联系导师的决策建议。

输出格式（必须严格遵循）：
{
  "score": 85,  // 0-100的匹配度分数
  "decision": "推荐",  // "推荐" | "谨慎" | "不推荐"
  "summary": "简要总结判断理由，1-2句话",  // 中文总结
  "match": {
    "pros": ["匹配点1", "匹配点2", "匹配点3"],  // 至少3个具体匹配点
    "cons": ["不匹配点1", "不匹配点2"]  // 不匹配的点
  },
  "risks": [
    {"level": "中", "text": "风险描述"}
  ],
  "strategy": {
    "tone": "学术",  // "学术" | "工程" | "简洁"
    "must": ["邮件中必须提到的点1", "邮件中必须提到的点2"],
    "avoid": ["邮件中要避免提及的点1"],
    "core": "邮件核心策略，1句话"
  }
}

要求：
- 输出必须使用中文
- 不要泛泛而谈，必须具体
- 所有内容必须"服务决策"
- match.pros 至少3条，match.cons 至少2条
- risks 至少2条
- strategy.must 至少2条，strategy.avoid 至少1条`;

  const userPrompt = `导师画像：
${JSON.stringify(profile.mentor, null, 2)}

学生画像：
${JSON.stringify(profile.student, null, 2)}

请基于以上信息，生成完整的决策分析报告。`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { type: 'json_object' }
  );

  if (!response) {
    throw new Error('Decision agent 返回为空');
  }

  console.log('[Decision Agent] Raw response:', response);

  try {
    const parsed = JSON.parse(response) as Decision;
    return parsed;
  } catch {
    throw new Error('Decision agent 返回格式错误: ' + response);
  }
}

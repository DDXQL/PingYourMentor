// =============================================================================
// OpenAI Client Configuration
// =============================================================================

import OpenAI from 'openai';
import debug from '@/lib/debug';

// 从环境变量读取 API Key - 仅服务端使用
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

if (!apiKey) {
  debug.warn('[OpenAI Config] WARNING: OPENAI_API_KEY is not set!');
}

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
export const MAX_TOKENS = 4000;
export const TEMPERATURE = 0.7;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENAI_BASE_URL_REFERER || 'http://localhost:3000',
    'X-Title': 'PingYourMentor',
  },
});

export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  responseFormat?: { type: 'json_object' },
  options?: { timeout?: number }
) {
  debug.log('[OpenAI] Creating chat completion...');
  debug.log('[OpenAI] Model:', MODEL);

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      response_format: responseFormat,
    }, {
      timeout: options?.timeout || 60000,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    debug.error('[OpenAI] Error:', error.message);
    throw error;
  }
}

export { openai };

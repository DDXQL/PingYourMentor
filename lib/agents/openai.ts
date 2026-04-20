// =============================================================================
// OpenAI Client Configuration
// =============================================================================

import OpenAI from 'openai';

const apiKey = 'sk-iR9EzbPeCdZV1fpLeSHUAZU65pLx5ltqTWNeiDe3J386Y2GN';
const baseURL = 'https://api.openai-proxy.org/v1';

console.log('[OpenAI Config] API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
console.log('[OpenAI Config] Base URL:', baseURL);
console.log('[OpenAI Config] Model:', process.env.OPENAI_MODEL || 'gpt-4.1-mini');

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENAI_BASE_URL || 'http://localhost:3000',
    'X-Title': 'PingYourMentor',
  },
});

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
export const MAX_TOKENS = 4000;
export const TEMPERATURE = 0.7;

export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  responseFormat?: { type: 'json_object' }
) {
  console.log('[OpenAI] Creating chat completion...');
  console.log('[OpenAI] Request URL:', `${baseURL}/chat/completions`);
  console.log('[OpenAI] Model:', MODEL);
  console.log('[OpenAI] Messages count:', messages.length);
  
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      response_format: responseFormat,
    });

    console.log('[OpenAI] Response received successfully');
    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('[OpenAI] Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    throw error;
  }
}

export { openai };

// =============================================================================
// Supabase Client Configuration
// =============================================================================
// API Key 安全说明：
// - NEXT_PUBLIC_SUPABASE_URL: 公开，可暴露给客户端
// - NEXT_PUBLIC_SUPABASE_ANON_KEY: 公开，客户端使用的匿名密钥（权限受限）
// - SUPABASE_SERVICE_ROLE_KEY: 私有，仅服务端使用（权限最高）
// - 禁止将 SUPABASE_SERVICE_ROLE_KEY 用于客户端

import { createClient } from '@supabase/supabase-js';

// 公开变量（可安全暴露给客户端）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 私有变量（仅服务端可用）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 公共客户端（浏览器端使用）- 仅使用 Anon Key
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 服务端客户端（Node.js 环境）- 使用 Service Role Key
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// 仅导出安全的公开变量
export { supabaseUrl, supabaseAnonKey };

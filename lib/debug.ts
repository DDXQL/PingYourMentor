// =============================================================================
// Debug Utilities
// =============================================================================
// 生产环境禁用 console.log，生产环境只输出 error 和 warn

const isDev = process.env.NODE_ENV === 'development';

export const debug = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
};

export default debug;

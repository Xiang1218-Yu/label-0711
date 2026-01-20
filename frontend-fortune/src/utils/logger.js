/**
 * 调试日志工具
 */
const isDev = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const Logger = {
  info(...args) {
    if (isDev) {
      console.log('[INFO]', ...args);
    }
  },
  
  warn(...args) {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },
  
  error(...args) {
    console.error('[ERROR]', ...args);
  },
  
  debug(...args) {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },
  
  table(data, columns) {
    if (isDev) {
      console.table(data, columns);
    }
  }
};

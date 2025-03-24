import { debug } from './debug';

export const debugEducation = {
  log: (message: string, data?: any, level: 'success' | 'error' | 'info' = 'info') => {
    debug.log(`[Education] ${message}`, data, level);
  }
}; 
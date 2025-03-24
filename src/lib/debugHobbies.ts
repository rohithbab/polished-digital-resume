import { debug } from './debug';

export const debugHobbies = {
  log: (message: string, data?: any, level: 'success' | 'error' | 'info' = 'info') => {
    debug.log(`[Hobbies] ${message}`, data, level);
  }
}; 
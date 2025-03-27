// Debug utility functions
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
};

// Component lifecycle debugging
export const withDebug = (componentName: string) => {
  return {
    onMount: () => debug.log(`${componentName} mounted`),
    onUnmount: () => debug.log(`${componentName} unmounted`),
    onUpdate: (props: any) => debug.log(`${componentName} updated`, props),
    onError: (error: any) => debug.error(`${componentName} error`, error)
  };
}; 
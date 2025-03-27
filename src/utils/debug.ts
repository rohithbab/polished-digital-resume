import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface DebugLog {
  type: 'error' | 'info' | 'warning' | 'log';
  message: string;
  details?: any;
  timestamp: Date;
}

class Debug {
  private static instance: Debug;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Debug {
    if (!Debug.instance) {
      Debug.instance = new Debug();
    }
    return Debug.instance;
  }

  private async logToFirebase(log: DebugLog) {
    try {
      await addDoc(collection(db, 'debug_logs'), {
        ...log,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log to Firebase:', error);
    }
  }

  private formatMessage(type: DebugLog['type'], message: string, details?: any): string {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    if (details) {
      formattedMessage += `\nDetails: ${JSON.stringify(details, null, 2)}`;
    }
    
    return formattedMessage;
  }

  async log(message: string, details?: any) {
    // For backward compatibility, log method uses info level
    await this.info(message, details);
  }

  async error(message: string, details?: any) {
    const log: DebugLog = {
      type: 'error',
      message,
      details,
      timestamp: new Date()
    };

    // Log to console in development
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message, details));
    }

    // Always log errors to Firebase
    await this.logToFirebase(log);
  }

  async info(message: string, details?: any) {
    const log: DebugLog = {
      type: 'info',
      message,
      details,
      timestamp: new Date()
    };

    // Log to console in development
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, details));
    }

    // Log to Firebase in production
    if (!this.isDevelopment) {
      await this.logToFirebase(log);
    }
  }

  async warning(message: string, details?: any) {
    const log: DebugLog = {
      type: 'warning',
      message,
      details,
      timestamp: new Date()
    };

    // Log to console in development
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warning', message, details));
    }

    // Log to Firebase in production
    if (!this.isDevelopment) {
      await this.logToFirebase(log);
    }
  }
}

export const debug = Debug.getInstance();

// Component lifecycle debugging
export const withDebug = (componentName: string) => {
  return {
    onMount: () => debug.info(`${componentName} mounted`),
    onUnmount: () => debug.info(`${componentName} unmounted`),
    onUpdate: (props: any) => debug.info(`${componentName} updated`, props),
    onError: (error: any) => debug.error(`${componentName} error`, error)
  };
}; 
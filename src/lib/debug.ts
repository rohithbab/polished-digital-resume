// Debug utility for Firebase operations
export interface DebugLog {
  timestamp: string;
  operation: string;
  data?: any;
  error?: any;
  status: 'success' | 'error' | 'info';
}

class FirebaseDebugger {
  private static instance: FirebaseDebugger;
  private logs: DebugLog[] = [];
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): FirebaseDebugger {
    if (!FirebaseDebugger.instance) {
      FirebaseDebugger.instance = new FirebaseDebugger();
    }
    return FirebaseDebugger.instance;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  log(operation: string, data?: any, status: 'success' | 'error' | 'info' = 'info') {
    if (!this.isEnabled) return;

    const log: DebugLog = {
      timestamp: new Date().toISOString(),
      operation,
      data,
      status
    };

    this.logs.push(log);
    this.printLog(log);

    // If it's an error, also show it in the UI
    if (status === 'error') {
      this.showErrorInUI(operation, data);
    }
  }

  private printLog(log: DebugLog) {
    const color = this.getStatusColor(log.status);
    console.log(
      `%c[${log.timestamp}] ${log.operation}`,
      `color: ${color}; font-weight: bold;`,
      log.data || ''
    );
  }

  private getStatusColor(status: DebugLog['status']): string {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'info': return '#2196F3';
      default: return '#000000';
    }
  }

  private showErrorInUI(operation: string, error: any) {
    // Create or get the debug panel
    let debugPanel = document.getElementById('firebase-debug-panel');
    if (!debugPanel) {
      debugPanel = document.createElement('div');
      debugPanel.id = 'firebase-debug-panel';
      debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 300px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow-y: auto;
      `;
      document.body.appendChild(debugPanel);
    }

    // Add the error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      margin-bottom: 8px;
      padding: 8px;
      background: #ffebee;
      border-left: 4px solid #f44336;
      border-radius: 4px;
    `;
    errorDiv.innerHTML = `
      <strong>${operation}</strong><br>
      ${error.message || JSON.stringify(error)}
    `;
    debugPanel.appendChild(errorDiv);

    // Auto-scroll to bottom
    debugPanel.scrollTop = debugPanel.scrollHeight;

    // Remove after 10 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 10000);
  }

  getLogs(): DebugLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    const debugPanel = document.getElementById('firebase-debug-panel');
    if (debugPanel) {
      debugPanel.innerHTML = '';
    }
  }
}

export const debug = FirebaseDebugger.getInstance(); 
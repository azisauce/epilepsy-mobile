/**
 * Logger utility for the app
 * Captures all logs, warnings, and errors
 */

export interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs in memory
  private isDevelopment = true; // Set to false in production if needed

  constructor() {
    this.setupConsoleInterception();
  }

  /**
   * Setup interception of console methods
   */
  private setupConsoleInterception() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    console.log = (...args) => {
      this.addLog('log', args);
      originalLog(...args);
    };

    console.error = (...args) => {
      this.addLog('error', args);
      originalError(...args);
    };

    console.warn = (...args) => {
      this.addLog('warn', args);
      originalWarn(...args);
    };

    console.info = (...args) => {
      this.addLog('info', args);
      originalInfo(...args);
    };

    console.debug = (...args) => {
      this.addLog('debug', args);
      originalDebug(...args);
    };
  }

  /**
   * Add a log entry
   */
  private addLog(level: LogEntry['level'], args: any[]) {
    const message = args
      .map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack}`;
        }
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    this.logs.push(entry);

    // Maintain max log size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as formatted string
   */
  exportLogs(): string {
    return this.logs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
  }

  /**
   * Log with context (useful for operations)
   */
  logOperation(operationName: string, status: 'start' | 'success' | 'error', data?: any) {
    const message = `[${operationName}] ${status}${data ? ': ' + JSON.stringify(data) : ''}`;
    if (status === 'error') {
      console.error(message);
    } else if (status === 'start') {
      console.log(`⏳ ${message}`);
    } else {
      console.log(`✅ ${message}`);
    }
  }

  /**
   * Print all logs to console (useful for debugging)
   */
  printAll() {
    console.log('📋 ===== APP LOGS =====');
    this.logs.forEach(log => {
      const icon = this.getLevelIcon(log.level);
      console.log(`${icon} [${log.timestamp}] ${log.message}`);
    });
    console.log('📋 ===== END LOGS =====');
  }

  private getLevelIcon(level: LogEntry['level']): string {
    switch (level) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'debug':
        return '🔍';
      default:
        return '📝';
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Make it globally accessible for debugging in React Native debugger
try {
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).appLogger = logger;
  }
} catch (e) {
  // Silently fail if globalThis is not available
}

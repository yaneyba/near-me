/**
 * Logging Utility
 *
 * Provides structured logging with different log levels.
 * In production, debug logs are suppressed.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
}

/**
 * Check if we're in production environment
 */
function isProduction(): boolean {
  // Check for common production indicators
  return (
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV === 'production'
  );
}

/**
 * Format a log entry
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
    entry.message
  ];

  if (entry.data && Object.keys(entry.data).length > 0) {
    parts.push(JSON.stringify(entry.data));
  }

  return parts.join(' ');
}

/**
 * Internal logging function
 */
function log(level: LogLevel, message: string, data?: Record<string, any>): void {
  // Suppress debug logs in production
  if (level === 'debug' && isProduction()) {
    return;
  }

  const entry: LogEntry = {
    level,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  const formattedMessage = formatLogEntry(entry);

  // Use appropriate console method
  switch (level) {
    case 'error':
      console.error(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'info':
      console.info(formattedMessage);
      break;
    case 'debug':
    default:
      console.log(formattedMessage);
      break;
  }
}

/**
 * Public logging interface
 */
export const logger = {
  /**
   * Debug level - development only, suppressed in production
   */
  debug: (message: string, data?: Record<string, any>) => log('debug', message, data),

  /**
   * Info level - general informational messages
   */
  info: (message: string, data?: Record<string, any>) => log('info', message, data),

  /**
   * Warn level - warning messages that don't prevent operation
   */
  warn: (message: string, data?: Record<string, any>) => log('warn', message, data),

  /**
   * Error level - error conditions that need attention
   */
  error: (message: string, data?: Record<string, any>) => log('error', message, data),
};

/**
 * Create a logger with a specific context
 */
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: Record<string, any>) =>
      logger.debug(`[${context}] ${message}`, data),
    info: (message: string, data?: Record<string, any>) =>
      logger.info(`[${context}] ${message}`, data),
    warn: (message: string, data?: Record<string, any>) =>
      logger.warn(`[${context}] ${message}`, data),
    error: (message: string, data?: Record<string, any>) =>
      logger.error(`[${context}] ${message}`, data),
  };
}

/**
 * Logger Service
 *
 * Centralized logging with environment-aware behavior.
 * In development: logs to console
 * In production: can integrate with error tracking services
 *
 * @module services/Logger
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

type _LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class LoggerService {
  private isDevelopment = __DEV__;

  /**
   * Logs debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Logs informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Logs warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  /**
   * Logs error messages with stack traces
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorInfo =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : { error };

    console.error(`[ERROR] ${message}`, { ...errorInfo, ...context });

    // In production, send to error tracking service (e.g., Sentry)
    if (!this.isDevelopment && error instanceof Error) {
      this.sendToErrorTracking(message, error, context);
    }
  }

  /**
   * Logs performance metrics
   */
  performance(label: string, duration: number, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`, context || '');
    }
  }

  /**
   * Creates a performance timer
   */
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.performance(label, duration);
    };
  }

  /**
   * Sends error to external tracking service (placeholder)
   * In production, integrate with Sentry, LogRocket, etc.
   */
  private sendToErrorTracking(message: string, error: Error, _context?: LogContext): void {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { tags: context });
    // eslint-disable-next-line no-console
    console.error('Error tracking not configured:', message, error);
  }

  /**
   * Logs user actions for analytics (optional)
   */
  logUserAction(action: string, properties?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[USER ACTION] ${action}`, properties || '');
    }
    // TODO: Integrate with analytics service
    // Example: analytics.track(action, properties);
  }
}

// Export singleton instance
export const Logger = new LoggerService();

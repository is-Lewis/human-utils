/**
 * Logger Service
 *
 * Centralised logging with environment-aware behaviour and Sentry integration.
 * In development: logs to console
 * In production: sends errors to Sentry for monitoring
 *
 * @module services/Logger
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import * as Sentry from '@sentry/react-native';

type _LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class LoggerService {
  private isDevelopment = __DEV__;

  /**
   * Initialises Sentry for production error tracking.
   * Call this once at app startup.
   *
   * @param dsn - Your Sentry DSN from sentry.io project settings
   */
  init(dsn: string): void {
    if (!this.isDevelopment && dsn) {
      Sentry.init({
        dsn,
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // Adjust this value in production
        tracesSampleRate: 0.2, // 20% of transactions
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000, // 30 seconds
      });
    }
  }

  /**
   * Logs debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, context || '');
    }
    // Debug logs not sent to Sentry (too noisy)
  }

  /**
   * Logs informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, context || '');
    }
    // Info logs not sent to Sentry (too noisy)
  }

  /**
   * Logs warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
    
    if (!this.isDevelopment) {
      Sentry.captureMessage(message, {
        level: 'warning',
        contexts: { custom: context },
      });
    }
  }

  /**
   * Logs error messages with stack traces and sends to Sentry in production
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

    // Send to Sentry in production
    if (!this.isDevelopment) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          contexts: { custom: { message, ...context } },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          contexts: { custom: { ...errorInfo, ...context } },
        });
      }
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
    // Performance logs not sent to Sentry (use Sentry's built-in performance monitoring instead)
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
   * Logs user actions for analytics
   */
  logUserAction(action: string, properties?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`[USER ACTION] ${action}`, properties || '');
    }
    
    // Add breadcrumb for Sentry (helps with debugging errors)
    if (!this.isDevelopment) {
      Sentry.addBreadcrumb({
        category: 'user-action',
        message: action,
        data: properties,
        level: 'info',
      });
    }
  }
}

// Export singleton instance
export const Logger = new LoggerService();

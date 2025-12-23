/**
 * Error Handler Utility
 *
 * Centralised error handling for consistent user feedback across the application.
 * Provides standardised alert dialogs based on error severity and context.
 *
 * @module utils/errorHandler
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Alert } from 'react-native';
import { Logger } from '../services/Logger';

/**
 * Error status levels indicating severity and handling approach.
 */
export type ErrorStatus = 'error' | 'warning' | 'info' | 'success';

/**
 * Options for customising error handler behaviour.
 */
export interface ErrorHandlerOptions {
  /** The severity status of the error */
  status: ErrorStatus;
  
  /** The message to display to the user */
  message: string;
  
  /** Optional title for the alert dialog (defaults based on status) */
  title?: string;
  
  /** Optional callback to execute after user dismisses the alert */
  onDismiss?: () => void;
  
  /** Whether to log the error (defaults to true) */
  shouldLog?: boolean;
  
  /** Additional context data to include in logs */
  context?: Record<string, unknown>;
}

/**
 * Default titles for each error status.
 */
const DEFAULT_TITLES: Record<ErrorStatus, string> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Information',
  success: 'Success',
};

/**
 * Handles errors with consistent user feedback and logging.
 *
 * Displays an appropriate alert dialog based on the error status and logs
 * the error with relevant context for debugging and analytics.
 *
 * @param options - Configuration options for error handling
 *
 * @example
 * ```ts
 * handleError({
 *   status: 'error',
 *   message: 'Failed to convert case format',
 *   context: { inputLength: text.length }
 * });
 * ```
 *
 * @example
 * ```ts
 * handleError({
 *   status: 'success',
 *   message: 'Text copied to clipboard',
 *   title: 'Copied!',
 *   shouldLog: false
 * });
 * ```
 */
export const handleError = (options: ErrorHandlerOptions): void => {
  const {
    status,
    message,
    title = DEFAULT_TITLES[status],
    onDismiss,
    shouldLog = true,
    context = {},
  } = options;

  // Log the error if enabled
  if (shouldLog) {
    const logContext = { status, ...context };
    
    switch (status) {
      case 'error':
        Logger.error(message, logContext);
        break;
      case 'warning':
        Logger.warn(message, logContext);
        break;
      case 'info':
      case 'success':
        Logger.info(message, logContext);
        break;
    }
  }

  // Display alert to user
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: onDismiss,
    },
  ]);
};

/**
 * Quick helper for displaying error messages.
 *
 * @param message - The error message to display
 * @param context - Optional context data for logging
 *
 * @example
 * ```ts
 * showError('Invalid input provided');
 * ```
 */
export const showError = (message: string, context?: Record<string, unknown>): void => {
  handleError({ status: 'error', message, context });
};

/**
 * Quick helper for displaying warning messages.
 *
 * @param message - The warning message to display
 * @param context - Optional context data for logging
 *
 * @example
 * ```ts
 * showWarning('This operation cannot be undone');
 * ```
 */
export const showWarning = (message: string, context?: Record<string, unknown>): void => {
  handleError({ status: 'warning', message, context });
};

/**
 * Quick helper for displaying informational messages.
 *
 * @param message - The info message to display
 * @param shouldLog - Whether to log this message (defaults to false for info)
 *
 * @example
 * ```ts
 * showInfo('Feature coming soon');
 * ```
 */
export const showInfo = (message: string, shouldLog = false): void => {
  handleError({ status: 'info', message, shouldLog });
};

/**
 * Quick helper for displaying success messages.
 *
 * @param message - The success message to display
 * @param shouldLog - Whether to log this message (defaults to false for success)
 *
 * @example
 * ```ts
 * showSuccess('Operation completed successfully');
 * ```
 */
export const showSuccess = (message: string, shouldLog = false): void => {
  handleError({ status: 'success', message, shouldLog });
};

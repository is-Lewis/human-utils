/**
 * JSON Formatter Types
 *
 * @module tools/json-formatter/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { HistoryEntry } from '../utils/types';

/**
 * JSON formatting operation type
 */
export type JsonOperation = 'format' | 'minify' | 'validate';

/**
 * JSON formatting options
 */
export interface JsonFormatOptions {
  /** Number of spaces for indentation (2 or 4) */
  indentSize?: 2 | 4;

  /** Sort object keys alphabetically */
  sortKeys?: boolean;

  /** Escape unicode characters */
  escapeUnicode?: boolean;
}

/**
 * JSON validation result
 */
export interface JsonValidationResult {
  /** Whether the JSON is valid */
  valid: boolean;

  /** Error message if invalid */
  error?: string;

  /** Line number of error */
  errorLine?: number;

  /** Column number of error */
  errorColumn?: number;
}

/**
 * JSON formatting result
 */
export interface JsonFormatResult {
  /** Whether formatting was successful */
  success: boolean;

  /** Formatted or minified JSON string */
  output?: string;

  /** Error message if failed */
  error?: string;

  /** Original size in bytes */
  originalSize?: number;

  /** Formatted size in bytes */
  formattedSize?: number;
}

/**
 * JSON history entry
 */
export interface JsonHistoryEntry extends HistoryEntry {
  /** Operation performed */
  operation: JsonOperation;

  /** Truncated input (first 100 chars) */
  input: string;

  /** Truncated output (first 100 chars) */
  output: string;

  /** Formatting options used */
  options?: JsonFormatOptions;
}

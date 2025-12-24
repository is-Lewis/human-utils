/**
 * URL Encoder/Decoder Types
 *
 * Type definitions for the URL encoding and decoding tool.
 *
 * @module tools/url-encoder/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { HistoryEntry } from '../utils/types';

/**
 * Supported operations for URL tool
 */
export type UrlOperation = 'encode' | 'decode';

/**
 * Result of a URL operation
 */
export interface UrlResult {
  /** The output text after encoding/decoding */
  output: string;
  /** The operation that was performed */
  operation: UrlOperation;
  /** Whether the operation was successful */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
}

/**
 * History entry for URL conversions
 */
export interface UrlHistoryEntry extends HistoryEntry {
  /** Operation performed */
  operation: UrlOperation;
  /** Input text */
  input: string;
  /** Output text */
  output: string;
}

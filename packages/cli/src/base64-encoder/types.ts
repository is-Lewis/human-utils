/**
 * Base64 Encoder/Decoder Types
 *
 * Type definitions for the Base64 encoding and decoding tool.
 *
 * @module tools/base64-encoder/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { HistoryEntry } from '../json-formatter/types';

/**
 * Supported operations for Base64 tool
 */
export type Base64Operation = 'encode' | 'decode';

/**
 * Base64 encoding options
 */
export interface Base64Options {
  /** Whether to use URL-safe encoding (- and _ instead of + and /) */
  urlSafe?: boolean;
}

/**
 * Result of a Base64 operation
 */
export interface Base64Result {
  /** The output text after encoding/decoding */
  output: string;
  /** The operation that was performed */
  operation: Base64Operation;
  /** Size of input in bytes */
  inputSize: number;
  /** Size of output in bytes */
  outputSize: number;
  /** Whether the operation was successful */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
}

/**
 * History entry for Base64 conversions
 */
export interface Base64HistoryEntry extends HistoryEntry {
  /** Operation performed */
  operation: Base64Operation;
  /** Input text */
  input: string;
  /** Output text */
  output: string;
  /** Whether URL-safe encoding was used */
  urlSafe?: boolean;
}

/**
 * URL Encoder/Decoder Core Functions
 *
 * Provides URL encoding and decoding functionality with support for both
 * full URL encoding and component-level encoding.
 *
 * @module tools/url-encoder
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { UrlOperation, UrlResult } from './types';

// Re-export types
export type { UrlOperation, UrlResult, UrlHistoryEntry } from './types';

/**
 * Encodes a URL component.
 *
 * Uses encodeURIComponent to safely encode special characters.
 *
 * @param input - The text to encode
 * @returns Encoded URL result
 *
 * @example
 * ```ts
 * const result = encodeUrl('Hello World!');
 * console.log(result.output); // 'Hello%20World!'
 * ```
 */
export function encodeUrl(input: string): UrlResult {
  if (!input || !input.trim()) {
    return {
      success: false,
      error: 'Input cannot be empty',
      output: '',
      operation: 'encode',
    };
  }

  try {
    const output = encodeURIComponent(input);

    return {
      success: true,
      output,
      operation: 'encode',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encoding failed',
      output: '',
      operation: 'encode',
    };
  }
}

/**
 * Decodes a URL component.
 *
 * Uses decodeURIComponent to decode percent-encoded characters.
 * Handles malformed URLs gracefully.
 *
 * @param input - The encoded text to decode
 * @returns Decoded URL result
 *
 * @example
 * ```ts
 * const result = decodeUrl('Hello%20World!');
 * console.log(result.output); // 'Hello World!'
 * ```
 */
export function decodeUrl(input: string): UrlResult {
  if (!input || !input.trim()) {
    return {
      success: false,
      error: 'Input cannot be empty',
      output: '',
      operation: 'decode',
    };
  }

  try {
    const output = decodeURIComponent(input);

    return {
      success: true,
      output,
      operation: 'decode',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid URL encoding - malformed input',
      output: '',
      operation: 'decode',
    };
  }
}

/**
 * Performs URL encoding or decoding based on operation type.
 *
 * @param input - The text to process
 * @param operation - The operation to perform
 * @returns Operation result
 *
 * @example
 * ```ts
 * const result = processUrl('Hello World', 'encode');
 * console.log(result.output); // 'Hello%20World'
 * ```
 */
export function processUrl(
  input: string,
  operation: UrlOperation,
): UrlResult {
  return operation === 'encode' ? encodeUrl(input) : decodeUrl(input);
}

/**
 * Validates if a string is properly URL encoded.
 *
 * @param input - The string to validate
 * @returns True if properly encoded, false otherwise
 *
 * @example
 * ```ts
 * console.log(isUrlEncoded('Hello%20World')); // true
 * console.log(isUrlEncoded('Hello World')); // false
 * ```
 */
export function isUrlEncoded(input: string): boolean {
  try {
    const decoded = decodeURIComponent(input);
    const reencoded = encodeURIComponent(decoded);
    return reencoded === input;
  } catch {
    return false;
  }
}

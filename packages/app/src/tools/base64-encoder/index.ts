/**
 * Base64 Encoder/Decoder Tool
 * 
 * Provides utilities for encoding and decoding text using Base64 encoding.
 * Works in both Node.js and React Native environments.
 * 
 * @module tools/base64-encoder
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Base64Result, Base64Operation, Base64Options } from './types';

/**
 * encodeToBase64
 * 
 * Encodes a plain text string to Base64 format.
 * Automatically detects the environment (Node.js vs React Native) and uses the appropriate method.
 * 
 * @param text - The plain text string to encode
 * @param options - Encoding options (e.g., URL-safe)
 * @returns Base64 encoded string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const encoded = encodeToBase64("Hello World");
 * // Returns: "SGVsbG8gV29ybGQ="
 * 
 * const urlSafe = encodeToBase64("Hello World", { urlSafe: true });
 * // Returns URL-safe Base64
 * ```
 */
export const encodeToBase64 = (text: string, options?: Base64Options): string => {
  try {
    let encoded: string;
    
    if (typeof process !== 'undefined' && process.versions?.node) {
      // Node.js
      encoded = Buffer.from(text, 'utf-8').toString('base64');
    } else {
      // React Native/Browser
      encoded = btoa(
        encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })
      );
    }
    
    // Convert to URL-safe if requested
    if (options?.urlSafe) {
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    return encoded;
  } catch (error) {
    throw new Error(`Failed to encode: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * decodeFromBase64
 * 
 * Decodes a Base64 encoded string back to plain text.
 * Automatically detects the environment (Node.js vs React Native) and uses the appropriate method.
 * Supports both standard and URL-safe Base64.
 * 
 * @param base64Text - The Base64 encoded string to decode
 * @returns Decoded plain text string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const decoded = decodeFromBase64("SGVsbG8gV29ybGQ=");
 * // Returns: "Hello World"
 * ```
 */
export const decodeFromBase64 = (base64Text: string): string => {
  try {
    // Convert URL-safe Base64 to standard Base64
    let standardBase64 = base64Text.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (standardBase64.length % 4 !== 0) {
      standardBase64 += '=';
    }
    
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.versions?.node) {
      // Node.js - use Buffer
      return Buffer.from(standardBase64, 'base64').toString('utf-8');
    } else {
      // React Native/Browser - use atob
      const decoded = atob(standardBase64);
      // Convert from Latin1 back to UTF-8
      return decodeURIComponent(
        decoded.split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    }
  } catch (error) {
    throw new Error(`Failed to decode: ${error instanceof Error ? error.message : 'Invalid Base64 string'}`);
  }
};

/**
 * isValidBase64
 * 
 * Validates whether a string is valid Base64 format (standard or URL-safe).
 * 
 * @param text - The string to validate
 * @returns True if valid Base64, false otherwise
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * isValidBase64("SGVsbG8gV29ybGQ="); // true
 * isValidBase64("SGVsbG8gV29ybGQ"); // true (URL-safe)
 * isValidBase64("Not Base64!"); // false
 * ```
 */
export const isValidBase64 = (text: string): boolean => {
  // Base64 regex: standard or URL-safe
  const base64Regex = /^[A-Za-z0-9+/\-_]*={0,2}$/;
  
  if (!base64Regex.test(text)) {
    return false;
  }
  
  // Try to decode to verify it's actually valid
  try {
    decodeFromBase64(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * processBase64
 * 
 * Performs a Base64 operation (encode or decode) and returns detailed results.
 * 
 * @param input - The input text to process
 * @param operation - The operation to perform ('encode' or 'decode')
 * @returns Result object with output, sizes, and success status
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const result = processBase64("Hello World", "encode");
 * console.log(result.output); // "SGVsbG8gV29ybGQ="
 * console.log(result.inputSize); // 11
 * console.log(result.outputSize); // 16
 * ```
 */
export const processBase64 = (input: string, operation: Base64Operation): Base64Result => {
  try {
    const output = operation === 'encode' 
      ? encodeToBase64(input)
      : decodeFromBase64(input);
    
    return {
      output,
      operation,
      inputSize: new Blob([input]).size,
      outputSize: new Blob([output]).size,
      success: true
    };
  } catch (error) {
    return {
      output: '',
      operation,
      inputSize: new Blob([input]).size,
      outputSize: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * detectBase64
 * 
 * Detects if the input text appears to be Base64 encoded.
 * 
 * @param text - The text to analyze
 * @returns True if text appears to be Base64
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */
export const detectBase64 = (text: string): boolean => {
  if (!text || text.length < 4) return false;
  
  // Check if it matches Base64 pattern
  const base64Pattern = /^[A-Za-z0-9+/\-_]+=*$/;
  if (!base64Pattern.test(text.trim())) return false;
  
  // If it's valid Base64 and decodes to readable text, it's likely Base64
  if (isValidBase64(text.trim())) {
    try {
      const decoded = decodeFromBase64(text.trim());
      // Check if decoded text is printable (not binary)
      return /^[\x20-\x7E\s]*$/.test(decoded);
    } catch {
      return false;
    }
  }
  
  return false;
};

/**
 * processBatch
 * 
 * Processes multiple lines of text at once.
 * 
 * @param input - Multi-line input text
 * @param operation - Operation to perform
 * @param options - Encoding options
 * @returns Array of results for each line
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */
export const processBatch = (
  input: string, 
  operation: Base64Operation,
  options?: Base64Options
): Array<{ input: string; output: string; success: boolean; error?: string }> => {
  const lines = input.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    try {
      const output = operation === 'encode' 
        ? encodeToBase64(line, options)
        : decodeFromBase64(line);
      
      return { input: line, output, success: true };
    } catch (error) {
      return { 
        input: line, 
        output: '', 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
};

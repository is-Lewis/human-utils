/**
 * Type Definitions for Case Converter Tool
 *
 * Provides TypeScript type definitions for case conversion operations,
 * including all supported case formats, conversion result structures,
 * and history tracking interfaces.
 *
 * @module tools/case-converter/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { HistoryEntry } from '../utils/types';

/**
 * Supported case conversion formats.
 *
 * Defines all available case conventions that text can be converted to or from.
 * Each format follows specific naming and separator conventions commonly used
 * in programming and text formatting.
 *
 * @example
 * ```ts
 * const targetFormat: CaseType = 'camelCase';
 * const formats: CaseType[] = ['snake_case', 'kebab-case', 'PascalCase'];
 * ```
 */
export type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'Title Case'
  | 'Sentence case'
  | 'lowercase'
  | 'UPPERCASE';

/**
 * Result object returned from case conversion operations.
 *
 * Contains the conversion outcome, including success status, converted output,
 * any error messages, and the automatically detected source case format.
 *
 * @example
 * ```ts
 * // Successful conversion
 * const result: CaseConversionResult = {
 *   success: true,
 *   output: 'helloWorld',
 *   detectedCase: 'snake_case'
 * };
 *
 * // Failed conversion
 * const failed: CaseConversionResult = {
 *   success: false,
 *   error: 'Input text is required'
 * };
 * ```
 */
export interface CaseConversionResult {
  /** Whether the conversion completed successfully */
  success: boolean;

  /** The converted text in the target case format (only present on success) */
  output?: string;

  /** Error message describing what went wrong (only present on failure) */
  error?: string;

  /** The automatically detected case format of the input text */
  detectedCase?: CaseType;
}

/**
 * History entry for tracking case conversion operations.
 *
 * Extends the base HistoryEntry with case-specific information including
 * the original input, converted output, target case format, and detected
 * source case. Used for maintaining conversion history and undo/redo functionality.
 *
 * @example
 * ```ts
 * const historyItem: CaseHistoryEntry = {
 *   input: 'hello_world',
 *   output: 'helloWorld',
 *   targetCase: 'camelCase',
 *   sourceCase: 'snake_case',
 *   timestamp: Date.now()
 * };
 * ```
 */
export interface CaseHistoryEntry extends HistoryEntry {
  /** The original text before conversion */
  input: string;

  /** The converted text after applying the target case format */
  output: string;

  /** The case format that was converted to */
  targetCase: CaseType;

  /** The automatically detected case format of the input */
  sourceCase?: CaseType;
}

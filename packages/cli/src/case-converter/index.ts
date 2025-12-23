/**
 * Case Converter Tool
 *
 * Provides utilities for converting text between different case formats.
 *
 * @module tools/case-converter
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { CaseType, CaseConversionResult } from './types';

// Re-export types
export type { CaseType, CaseConversionResult, CaseHistoryEntry } from './types';

/**
 * Splits text into words by detecting case boundaries and separators.
 *
 * Handles multiple input formats including camelCase, PascalCase, snake_case,
 * kebab-case, and space-separated text.
 *
 * @param text - The text to split into words
 * @returns Array of words extracted from the input text
 *
 * @example
 * ```ts
 * splitIntoWords('camelCaseText') // ['camel', 'Case', 'Text']
 * splitIntoWords('snake_case_text') // ['snake', 'case', 'text']
 * splitIntoWords('kebab-case-text') // ['kebab', 'case', 'text']
 * ```
 */
const splitIntoWords = (text: string): string[] => {
  if (!text) return [];

  const withSeparators = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-\s]+/g, ' ');

  const words = withSeparators.trim().split(/\s+/);
  return words.filter(Boolean);
};

/**
 * Capitalises the first letter of a word and lowercases the rest.
 *
 * @param word - The word to capitalise
 * @returns The word with first letter uppercase and remaining letters lowercase
 *
 * @example
 * ```ts
 * capitaliseWord('hello') // 'Hello'
 * capitaliseWord('WORLD') // 'World'
 * ```
 *
 * @internal
 */
const capitaliseWord = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

/**
 * Detects the case format of the input text.
 *
 * Analyzes the text to determine which case convention it follows.
 * Supports detection of camelCase, PascalCase, snake_case, kebab-case,
 * CONSTANT_CASE, Title Case, Sentence case, lowercase, and UPPERCASE.
 *
 * @param text - The text to analyze
 * @returns Detected case type, or undefined if no format is detected
 *
 * @example
 * ```ts
 * detectCase('helloWorld') // 'camelCase'
 * detectCase('HelloWorld') // 'PascalCase'
 * detectCase('hello_world') // 'snake_case'
 * ```
 */
export const detectCase = (text: string): CaseType | undefined => {
  if (!text || text.trim().length === 0) return undefined;

  const trimmed = text.trim();
  const hasUnderscore = trimmed.includes('_');
  const hasHyphen = trimmed.includes('-');
  const isAllUpper = trimmed === trimmed.toUpperCase();
  const isAllLower = trimmed === trimmed.toLowerCase();

  if (hasUnderscore) {
    if (isAllUpper) return 'CONSTANT_CASE';
    if (/^[a-z0-9]+(?:_[a-z0-9]+)+$/.test(trimmed)) return 'snake_case';
  }

  if (hasHyphen && /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(trimmed)) return 'kebab-case';

  if (/^[a-z][A-Za-z0-9]*$/.test(trimmed) && /[A-Z]/.test(trimmed)) return 'camelCase';

  if (/^(?:[A-Z][a-z0-9]*)+$/.test(trimmed)) return 'PascalCase';

  if (/^(?:[A-Z][a-z0-9]*)(?:\s+[A-Z][a-z0-9]*)+$/.test(trimmed)) return 'Title Case';

  if (
    trimmed[0] === trimmed[0].toUpperCase() &&
    trimmed.slice(1) === trimmed.slice(1).toLowerCase()
  ) {
    return 'Sentence case';
  }

  if (isAllLower) return 'lowercase';
  if (isAllUpper) return 'UPPERCASE';

  return undefined;
};

/**
 * Helper function to wrap conversion logic with error handling.
 *
 * Provides consistent error handling and result formatting for all case
 * conversion functions. Validates input and automatically detects the
 * source case format.
 *
 * @param text - The input text to convert
 * @param converter - The conversion function to apply
 * @param caseName - The name of the target case format for error messages
 * @returns Conversion result with success status, output, and detected case
 *
 * @internal
 */
const convertWithErrorHandling = (
  text: string,
  converter: (text: string) => string,
  caseName: string
): CaseConversionResult => {
  try {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Input text is required' };
    }

    const output = converter(text);

    return {
      success: true,
      output,
      detectedCase: detectCase(text),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to convert to ${caseName}`,
    };
  }
};

/**
 * Converts text to camelCase format.
 *
 * The first word is lowercase, and subsequent words have their first letter
 * capitalised with no separators between words.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toCamelCase('hello world') // { success: true, output: 'helloWorld' }
 * toCamelCase('snake_case_text') // { success: true, output: 'snakeCaseText' }
 * ```
 */
export const toCamelCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => {
      const words = splitIntoWords(t);
      return words
        .map((word, index) => (index === 0 ? word.toLowerCase() : capitaliseWord(word)))
        .join('');
    },
    'camelCase'
  );
};

/**
 * Converts text to PascalCase format.
 *
 * All words have their first letter capitalised with no separators between
 * words. Also known as UpperCamelCase.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toPascalCase('hello world') // { success: true, output: 'HelloWorld' }
 * toPascalCase('kebab-case-text') // { success: true, output: 'KebabCaseText' }
 * ```
 */
export const toPascalCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => splitIntoWords(t).map(capitaliseWord).join(''),
    'PascalCase'
  );
};

/**
 * Converts text to snake_case format.
 *
 * All words are lowercase and separated by underscores.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toSnakeCase('hello world') // { success: true, output: 'hello_world' }
 * toSnakeCase('camelCaseText') // { success: true, output: 'camel_case_text' }
 * ```
 */
export const toSnakeCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => splitIntoWords(t).map(w => w.toLowerCase()).join('_'),
    'snake_case'
  );
};

/**
 * Converts text to kebab-case format.
 *
 * All words are lowercase and separated by hyphens.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toKebabCase('hello world') // { success: true, output: 'hello-world' }
 * toKebabCase('PascalCaseText') // { success: true, output: 'pascal-case-text' }
 * ```
 */
export const toKebabCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => splitIntoWords(t).map(w => w.toLowerCase()).join('-'),
    'kebab-case'
  );
};

/**
 * Converts text to CONSTANT_CASE format.
 *
 * All words are uppercase and separated by underscores. Commonly used for
 * constants and environment variables.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toConstantCase('hello world') // { success: true, output: 'HELLO_WORLD' }
 * toConstantCase('apiKey') // { success: true, output: 'API_KEY' }
 * ```
 */
export const toConstantCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => splitIntoWords(t).map(w => w.toUpperCase()).join('_'),
    'CONSTANT_CASE'
  );
};

/**
 * Converts text to Title Case format.
 *
 * All words have their first letter capitalised and are separated by spaces.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toTitleCase('hello world') // { success: true, output: 'Hello World' }
 * toTitleCase('snake_case_text') // { success: true, output: 'Snake Case Text' }
 * ```
 */
export const toTitleCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => splitIntoWords(t).map(capitaliseWord).join(' '),
    'Title Case'
  );
};

/**
 * Converts text to Sentence case format.
 *
 * Only the first letter of the entire text is capitalised, with the rest
 * lowercase. Words are separated by spaces.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toSentenceCase('hello world') // { success: true, output: 'Hello world' }
 * toSentenceCase('HELLO WORLD') // { success: true, output: 'Hello world' }
 * ```
 */
export const toSentenceCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(
    text,
    (t) => {
      const words = splitIntoWords(t);
      const joined = words.map(w => w.toLowerCase()).join(' ');
      return joined.charAt(0).toUpperCase() + joined.slice(1);
    },
    'Sentence case'
  );
};

/**
 * Converts all text to lowercase.
 *
 * All letters are converted to lowercase with no changes to spacing or
 * separators.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toLowerCase('Hello World') // { success: true, output: 'hello world' }
 * toLowerCase('SCREAMING_TEXT') // { success: true, output: 'screaming_text' }
 * ```
 */
export const toLowerCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(text, (t) => t.toLowerCase(), 'lowercase');
};

/**
 * Converts all text to UPPERCASE.
 *
 * All letters are converted to uppercase with no changes to spacing or
 * separators.
 *
 * @param text - The text to convert
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * toUpperCase('hello world') // { success: true, output: 'HELLO WORLD' }
 * toUpperCase('camelCase') // { success: true, output: 'CAMELCASE' }
 * ```
 */
export const toUpperCase = (text: string): CaseConversionResult => {
  return convertWithErrorHandling(text, (t) => t.toUpperCase(), 'UPPERCASE');
};

/**
 * Converts text to the specified case type.
 *
 * Unified conversion function that dispatches to the appropriate converter
 * based on the target case type. Supports all available case formats.
 *
 * @param text - The text to convert
 * @param targetCase - The target case type to convert to
 * @returns Conversion result containing success status, output, and detected case
 *
 * @example
 * ```ts
 * convertCase('hello world', 'camelCase') // { success: true, output: 'helloWorld' }
 * convertCase('HelloWorld', 'snake_case') // { success: true, output: 'hello_world' }
 * ```
 */
export const convertCase = (text: string, targetCase: CaseType): CaseConversionResult => {
  switch (targetCase) {
    case 'camelCase':
      return toCamelCase(text);
    case 'PascalCase':
      return toPascalCase(text);
    case 'snake_case':
      return toSnakeCase(text);
    case 'kebab-case':
      return toKebabCase(text);
    case 'CONSTANT_CASE':
      return toConstantCase(text);
    case 'Title Case':
      return toTitleCase(text);
    case 'Sentence case':
      return toSentenceCase(text);
    case 'lowercase':
      return toLowerCase(text);
    case 'UPPERCASE':
      return toUpperCase(text);
    default:
      return { success: false, error: `Unsupported case type: ${targetCase}` };
  }
};

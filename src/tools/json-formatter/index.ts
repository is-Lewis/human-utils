/**
 * JSON Formatter Core Functions
 * 
 * @module tools/json-formatter
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { JsonFormatOptions, JsonValidationResult, JsonFormatResult } from './types';

/**
 * Validates JSON string and returns detailed error information
 * 
 * @param jsonString - The JSON string to validate
 * @returns Validation result with error details if invalid
 * 
 * @example
 * ```ts
 * const result = validateJson('{"name": "John"}');
 * if (result.valid) {
 *   console.log('Valid JSON!');
 * }
 * ```
 */
export function validateJson(jsonString: string): JsonValidationResult {
  if (!jsonString || !jsonString.trim()) {
    return {
      valid: false,
      error: 'Empty input'
    };
  }

  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line and column from error message
      const match = error.message.match(/position (\d+)/);
      let errorLine: number | undefined;
      let errorColumn: number | undefined;
      
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        errorLine = lines.length;
        errorColumn = lines[lines.length - 1].length + 1;
      }
      
      return {
        valid: false,
        error: error.message,
        errorLine,
        errorColumn
      };
    }
    
    return {
      valid: false,
      error: 'Invalid JSON'
    };
  }
}

/**
 * Sorts object keys alphabetically (recursive)
 * 
 * @param obj - The object or value to sort
 * @returns Object with sorted keys
 */
function sortKeysRecursive(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortKeysRecursive);
  }
  
  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = sortKeysRecursive(obj[key]);
    });
  
  return sorted;
}

/**
 * Formats JSON string with specified options
 * 
 * @param jsonString - The JSON string to format
 * @param options - Formatting options
 * @returns Formatted JSON result
 * 
 * @example
 * ```ts
 * const result = formatJson('{"name":"John","age":30}', { indentSize: 2 });
 * console.log(result.output);
 * // {
 * //   "name": "John",
 * //   "age": 30
 * // }
 * ```
 */
export function formatJson(
  jsonString: string,
  options: JsonFormatOptions = {}
): JsonFormatResult {
  const validation = validateJson(jsonString);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  try {
    const { indentSize = 2, sortKeys = false, escapeUnicode = false } = options;
    
    let parsed = JSON.parse(jsonString);
    
    // Sort keys if requested
    if (sortKeys) {
      parsed = sortKeysRecursive(parsed);
    }
    
    // Format with indentation
    let formatted = JSON.stringify(parsed, null, indentSize);
    
    // Escape unicode if requested
    if (escapeUnicode) {
      formatted = formatted.replace(/[\u007F-\uFFFF]/g, (char) => {
        return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
      });
    }
    
    const originalSize = new Blob([jsonString]).size;
    const formattedSize = new Blob([formatted]).size;
    
    return {
      success: true,
      output: formatted,
      originalSize,
      formattedSize
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Formatting failed'
    };
  }
}

/**
 * Minifies JSON string by removing all unnecessary whitespace
 * 
 * @param jsonString - The JSON string to minify
 * @returns Minified JSON result
 * 
 * @example
 * ```ts
 * const result = minifyJson('{\n  "name": "John"\n}');
 * console.log(result.output); // {"name":"John"}
 * ```
 */
export function minifyJson(jsonString: string): JsonFormatResult {
  const validation = validateJson(jsonString);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  try {
    const parsed = JSON.parse(jsonString);
    const minified = JSON.stringify(parsed);
    
    const originalSize = new Blob([jsonString]).size;
    const formattedSize = new Blob([minified]).size;
    
    return {
      success: true,
      output: minified,
      originalSize,
      formattedSize
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Minification failed'
    };
  }
}

/**
 * Checks if a string contains valid JSON
 * 
 * @param text - The string to check
 * @returns True if valid JSON, false otherwise
 */
export function isValidJson(text: string): boolean {
  return validateJson(text).valid;
}

/**
 * Extracts JSON structure information
 * 
 * @param jsonString - The JSON string to analyze
 * @returns Object with structure information
 */
export function getJsonInfo(jsonString: string): {
  type: string;
  keys?: number;
  items?: number;
  depth: number;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    const getDepth = (obj: any, currentDepth = 1): number => {
      if (obj === null || typeof obj !== 'object') {
        return currentDepth;
      }
      
      const values = Array.isArray(obj) ? obj : Object.values(obj);
      if (values.length === 0) {
        return currentDepth;
      }
      
      return Math.max(...values.map(val => getDepth(val, currentDepth + 1)));
    };
    
    const type = Array.isArray(parsed) ? 'array' : typeof parsed === 'object' && parsed !== null ? 'object' : typeof parsed;
    const depth = getDepth(parsed);
    
    if (Array.isArray(parsed)) {
      return { type, items: parsed.length, depth };
    } else if (typeof parsed === 'object' && parsed !== null) {
      return { type, keys: Object.keys(parsed).length, depth };
    }
    
    return { type, depth };
  } catch {
    return null;
  }
}

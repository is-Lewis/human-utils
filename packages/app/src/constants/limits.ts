/**
 * Application Limits and Constants
 * 
 * Centralized configuration for limits, thresholds, and magic numbers.
 * 
 * @module constants/limits
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

export const LIMITS = {
  /**
   * History settings for tool operations
   */
  HISTORY: {
    /** Maximum number of history items to keep */
    MAX_ITEMS: 10,
    /** Maximum characters to preview in history */
    PREVIEW_LENGTH: 100,
  },

  /**
   * File operation limits
   */
  FILE: {
    /** Maximum file size in megabytes */
    MAX_SIZE_MB: 1,
    /** Maximum file size in bytes */
    MAX_SIZE_BYTES: 1 * 1024 * 1024,
    /** Allowed MIME types for text files */
    ALLOWED_TEXT_TYPES: ['text/plain', 'text/csv', 'text/html'],
    /** Allowed MIME types for JSON files */
    ALLOWED_JSON_TYPES: ['application/json', 'text/plain'],
  },

  /**
   * Lorem Ipsum generation limits
   */
  LOREM: {
    /** Maximum words to generate */
    MAX_WORDS: 500,
    /** Maximum sentences to generate */
    MAX_SENTENCES: 50,
    /** Maximum paragraphs to generate */
    MAX_PARAGRAPHS: 10,
    /** Minimum count for any unit */
    MIN_COUNT: 1,
  },

  /**
   * UUID generation limits
   */
  UUID: {
    /** Maximum UUIDs to generate in CLI */
    MAX_GENERATE_CLI: 10_000,
    /** Maximum UUIDs to generate in app */
    MAX_GENERATE_APP: 100,
    /** Minimum UUIDs to generate */
    MIN_GENERATE: 1,
    /** UUID v1 Gregorian calendar offset (October 15, 1582) */
    V1_GREGORIAN_OFFSET: 0x01B21DD213814000n,
    /** Warning threshold for performance */
    PERFORMANCE_WARNING_THRESHOLD: 50,
  },

  /**
   * Base64 operation limits
   */
  BASE64: {
    /** Maximum input size for encoding (bytes) */
    MAX_INPUT_SIZE: 10 * 1024 * 1024, // 10MB
    /** Maximum lines for batch processing */
    MAX_BATCH_LINES: 1000,
  },

  /**
   * JSON operation limits
   */
  JSON: {
    /** Maximum JSON size to format (bytes) */
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    /** Maximum nesting depth to analyze */
    MAX_DEPTH: 100,
  },

  /**
   * Performance settings
   */
  PERFORMANCE: {
    /** Debounce delay for validation (ms) */
    VALIDATION_DEBOUNCE_MS: 300,
    /** Debounce delay for search (ms) */
    SEARCH_DEBOUNCE_MS: 200,
  },
} as const;

/**
 * Error Messages
 * 
 * Centralized error messages for consistency across the app.
 */
export const ERROR_MESSAGES = {
  // Input validation
  INPUT_REQUIRED: (type: string) => `Please enter ${type} to process`,
  INPUT_EMPTY: 'Input cannot be empty',

  // Count validation
  INVALID_COUNT: (min: number, max: number) =>
    `Please enter a number between ${min} and ${max}`,
  COUNT_MUST_BE_POSITIVE: 'Count must be a positive number',
  COUNT_EXCEEDS_LIMIT: (limit: number) => `Count cannot exceed ${limit:,}`,

  // File operations
  FILE_TOO_LARGE: (maxMB: number) =>
    `Please select a file smaller than ${maxMB}MB`,
  FILE_INVALID_TYPE: (allowed: string[]) =>
    `Invalid file type. Allowed types: ${allowed.join(', ')}`,
  FILE_LOAD_FAILED: 'Failed to load file',
  FILE_SAVE_FAILED: 'Failed to save file',

  // UUID specific
  UUID_V5_REQUIRES_PARAMS: 'UUID v5 requires both namespace and name',
  UUID_INVALID_FORMAT: 'Invalid UUID format',
  UUID_GENERATION_FAILED: 'Failed to generate UUID',

  // Base64 specific
  BASE64_INVALID_FORMAT: 'Invalid Base64 format',
  BASE64_DECODE_FAILED: 'Failed to decode Base64',
  BASE64_ENCODE_FAILED: 'Failed to encode to Base64',

  // JSON specific
  JSON_INVALID: 'Invalid JSON syntax',
  JSON_FORMAT_FAILED: 'Failed to format JSON',
  JSON_MINIFY_FAILED: 'Failed to minify JSON',
  JSON_PARSE_ERROR: (line?: number, col?: number) =>
    line && col
      ? `JSON parse error at line ${line}, column ${col}`
      : 'JSON parse error',

  // Generic
  UNKNOWN_ERROR: 'An unknown error occurred',
  OPERATION_FAILED: (operation: string) => `${operation} failed`,
  CRYPTO_UNAVAILABLE: 'Cryptographic functions are not available',
} as const;

/**
 * Success Messages
 * 
 * Centralized success messages for consistency.
 */
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied to clipboard',
  COPIED_COUNT: (count: number) => `${count} item(s) copied to clipboard`,
  SAVED: 'Saved successfully',
  GENERATED: 'Generated successfully',
  CLEARED: 'Cleared successfully',
  VALIDATED: 'Validation successful',
} as const;

/**
 * Warning Messages
 * 
 * User warnings for potentially problematic operations.
 */
export const WARNING_MESSAGES = {
  LARGE_OPERATION: (count: number) =>
    `Generating ${count:,} items may take a moment...`,
  PERFORMANCE_IMPACT: (count: number) =>
    `Generating ${count:,} items may impact performance`,
  HISTORY_CLEARED: 'All history will be permanently deleted',
  DATA_LOSS: 'Unsaved changes will be lost',
} as const;

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
    V1_GREGORIAN_OFFSET: 0x01b21dd213814000n,
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

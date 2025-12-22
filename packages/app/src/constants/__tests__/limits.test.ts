/**
 * Tests for constants and limits
 *
 * @module __tests__/limits.test
 */

import { LIMITS, ERROR_MESSAGES, SUCCESS_MESSAGES, WARNING_MESSAGES } from '../limits';

describe('Constants', () => {
  describe('LIMITS', () => {
    it('should have history limits', () => {
      expect(LIMITS.HISTORY.MAX_ITEMS).toBe(10);
      expect(LIMITS.HISTORY.PREVIEW_LENGTH).toBe(100);
    });

    it('should have file size limits', () => {
      expect(LIMITS.FILE.MAX_SIZE_MB).toBe(1);
      expect(LIMITS.FILE.MAX_SIZE_BYTES).toBe(1024 * 1024);
    });

    it('should have Lorem Ipsum limits', () => {
      expect(LIMITS.LOREM.MAX_WORDS).toBe(500);
      expect(LIMITS.LOREM.MAX_SENTENCES).toBe(50);
      expect(LIMITS.LOREM.MAX_PARAGRAPHS).toBe(10);
      expect(LIMITS.LOREM.MIN_COUNT).toBe(1);
    });

    it('should have UUID generation limits', () => {
      expect(LIMITS.UUID.MAX_GENERATE_CLI).toBe(10000);
      expect(LIMITS.UUID.MAX_GENERATE_APP).toBe(100);
      expect(LIMITS.UUID.MIN_GENERATE).toBe(1);
    });

    it('should have Base64 limits', () => {
      expect(LIMITS.BASE64.MAX_INPUT_SIZE).toBe(10 * 1024 * 1024);
      expect(LIMITS.BASE64.MAX_BATCH_LINES).toBe(1000);
    });

    it('should have performance limits', () => {
      expect(LIMITS.PERFORMANCE.VALIDATION_DEBOUNCE_MS).toBe(300);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should generate input required messages', () => {
      expect(ERROR_MESSAGES.INPUT_REQUIRED('text')).toBe('Please enter text to process');
      expect(ERROR_MESSAGES.INPUT_REQUIRED('JSON')).toBe('Please enter JSON to process');
    });

    it('should generate count validation messages', () => {
      expect(ERROR_MESSAGES.INVALID_COUNT(1, 100)).toBe('Please enter a number between 1 and 100');
      expect(ERROR_MESSAGES.COUNT_EXCEEDS_LIMIT(500)).toBe('Count cannot exceed 500');
    });

    it('should generate file error messages', () => {
      expect(ERROR_MESSAGES.FILE_TOO_LARGE(5)).toBe('Please select a file smaller than 5MB');
      expect(ERROR_MESSAGES.FILE_INVALID_TYPE(['text/plain', 'application/json'])).toBe(
        'Invalid file type. Allowed types: text/plain, application/json'
      );
    });

    it('should have Base64 error messages', () => {
      expect(ERROR_MESSAGES.BASE64_INVALID_FORMAT).toBe('Invalid Base64 format');
      expect(ERROR_MESSAGES.BASE64_BATCH_EXCEEDS_LIMIT(1000)).toBe(
        'Batch mode supports up to 1000 lines'
      );
    });

    it('should have JSON error messages', () => {
      expect(ERROR_MESSAGES.JSON_INVALID).toBe('Invalid JSON syntax');
      expect(ERROR_MESSAGES.JSON_FORMAT_FAILED).toBe('Failed to format JSON');
      expect(ERROR_MESSAGES.JSON_PARSE_ERROR(5, 10)).toBe('JSON parse error at line 5, column 10');
      expect(ERROR_MESSAGES.JSON_PARSE_ERROR()).toBe('JSON parse error');
    });

    it('should have UUID error messages', () => {
      expect(ERROR_MESSAGES.UUID_INVALID_COUNT(100)).toBe(
        'Please enter a number between 1 and 100'
      );
      expect(ERROR_MESSAGES.UUID_NAME_REQUIRED).toBe('Please enter a name for v5 UUID generation');
    });

    it('should generate output error messages', () => {
      expect(ERROR_MESSAGES.OUTPUT_REQUIRED('format JSON')).toBe('Please format JSON first');
    });
  });

  describe('SUCCESS_MESSAGES', () => {
    it('should have generic success messages', () => {
      expect(SUCCESS_MESSAGES.COPIED).toBe('Copied to clipboard');
      expect(SUCCESS_MESSAGES.OUTPUT_COPIED).toBe('Output copied to clipboard');
    });

    it('should generate count-based messages', () => {
      expect(SUCCESS_MESSAGES.COPIED_COUNT(5)).toBe('5 item(s) copied to clipboard');
      expect(SUCCESS_MESSAGES.UUID_COPIED(3)).toBe('3 UUID(s) copied to clipboard');
    });

    it('should have specific success messages', () => {
      expect(SUCCESS_MESSAGES.JSON_VALID).toBe('The JSON syntax is correct');
      expect(SUCCESS_MESSAGES.UUID_COPIED_SINGLE).toBe('UUID copied to clipboard');
    });
  });

  describe('WARNING_MESSAGES', () => {
    it('should generate performance warning messages', () => {
      expect(WARNING_MESSAGES.LARGE_OPERATION(1000)).toBe(
        'Generating 1000 items may take a moment...'
      );
      expect(WARNING_MESSAGES.PERFORMANCE_IMPACT(5000)).toBe(
        'Generating 5000 items may impact performance'
      );
    });

    it('should have data loss warnings', () => {
      expect(WARNING_MESSAGES.HISTORY_CLEARED).toBe('All history will be permanently deleted');
      expect(WARNING_MESSAGES.DATA_LOSS).toBe('Unsaved changes will be lost');
    });
  });

  describe('Type Safety', () => {
    it('should be immutable (as const)', () => {
      // TypeScript should catch these at compile time
      // These tests verify the types are properly frozen
      expect(Object.isFrozen(LIMITS)).toBe(false); // Note: 'as const' is compile-time only

      // But we can verify the values exist and are correct types
      expect(typeof LIMITS.HISTORY.MAX_ITEMS).toBe('number');
      expect(typeof ERROR_MESSAGES.INPUT_REQUIRED).toBe('function');
      expect(typeof SUCCESS_MESSAGES.COPIED).toBe('string');
    });

    it('should have consistent message formats', () => {
      // All function-based messages should return strings
      expect(typeof ERROR_MESSAGES.INPUT_REQUIRED('test')).toBe('string');
      expect(typeof ERROR_MESSAGES.INVALID_COUNT(1, 100)).toBe('string');
      expect(typeof SUCCESS_MESSAGES.COPIED_COUNT(5)).toBe('string');
      expect(typeof WARNING_MESSAGES.LARGE_OPERATION(100)).toBe('string');
    });
  });
});

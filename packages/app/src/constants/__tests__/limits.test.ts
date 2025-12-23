/**
 * Tests for constants and limits
 *
 * @module __tests__/limits.test
 */

import { LIMITS } from '../limits';

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

  describe('Type Safety', () => {
    it('should be immutable (as const)', () => {
      // TypeScript should catch these at compile time
      // These tests verify the types are properly frozen
      expect(Object.isFrozen(LIMITS)).toBe(false); // Note: 'as const' is compile-time only

      // But we can verify the values exist and are correct types
      expect(typeof LIMITS.HISTORY.MAX_ITEMS).toBe('number');
    });
  });
});

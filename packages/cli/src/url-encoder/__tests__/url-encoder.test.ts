/**
 * URL Encoder/Decoder Tests
 * 
 * This file contains unit tests for the URL Encoder/Decoder tool, covering encoding and decoding
 *
 * @module tools/url-encoder/__tests__
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { encodeUrl, decodeUrl, processUrl, isUrlEncoded } from '../index';

describe('URL Encoder/Decoder', () => {
  describe('encodeUrl', () => {
    it('should encode spaces correctly in component mode', () => {
      const result = encodeUrl('Hello World!');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello%20World!');
    });

    it('should encode special characters correctly in component mode', () => {
        const result = encodeUrl('Hello #World');
        expect(result.success).toBe(true);
        expect(result.output).toBe('Hello%20%23World');
    });

    it('should encode unicode characters in component mode', () => {
        const result = encodeUrl('こんにちは');
        expect(result.success).toBe(true);
        expect(result.output).toBe('%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF');
    });

    it('should handle empty input', () => {
      const result = encodeUrl('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('decodeUrl', () => {
    it('should decode percent-encoded strings correctly', () => {
      const result = decodeUrl('Hello%20World%21');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello World!');
    });

    it('should decode special characters correctly', () => {
      const result = decodeUrl('%21Hello%20%23World');
      expect(result.success).toBe(true);
      expect(result.output).toBe('!Hello #World');
    });

    it('should decode unicode characters', () => {
      const result = decodeUrl('%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF');
      expect(result.success).toBe(true);
      expect(result.output).toBe('こんにちは');
    });

    it('should handle malformed percent-encoded strings gracefully', () => {
      const result = decodeUrl('Hello%2World');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty input', () => {
      const result = decodeUrl('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('processUrl', () => {
    it('should process encode operation correctly', () => {
      const result = processUrl('Hello World!', 'encode');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello%20World!');
    });

    it('should process decode operation correctly', () => {
      const result = processUrl('Hello%20World%21', 'decode');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello World!');
    });
  });

  describe('isUrlEncoded', () => {
    it('should identify encoded strings correctly', () => {
      const encodedString = 'Hello%20World';
      const result = isUrlEncoded(encodedString);
      expect(result).toBe(true);
    });

    it('should identify plain strings correctly', () => {
      const plainString = 'Hello World!';
      const result = isUrlEncoded(plainString);
      expect(result).toBe(false);
    });

    it('should identify partially encoded strings correctly', () => {
      const partialString = 'Hello World';
      const result = isUrlEncoded(partialString);
      expect(result).toBe(false);
    });
  });
});

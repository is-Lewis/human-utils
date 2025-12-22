/**
 * Tests for crypto utilities
 *
 * @module __tests__/crypto.test
 */

import { isNodeEnvironment, getCryptoUUID, getRandomBytes, createSHA1Hash } from '../crypto';

describe('Crypto Utilities', () => {
  describe('isNodeEnvironment', () => {
    it('should return true in Node.js environment', () => {
      expect(isNodeEnvironment()).toBe(true);
    });

    it('should detect crypto module availability', () => {
      const result = isNodeEnvironment();
      if (result) {
        expect(() => require('crypto')).not.toThrow();
      }
    });
  });

  describe('getCryptoUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = getCryptoUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = getCryptoUUID();
      const uuid2 = getCryptoUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate 1000 unique UUIDs', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        uuids.add(getCryptoUUID());
      }
      expect(uuids.size).toBe(1000);
    });
  });

  describe('getRandomBytes', () => {
    it('should generate random bytes of specified length', () => {
      const bytes = getRandomBytes(16);
      expect(bytes).toHaveLength(16);
    });

    it('should generate different random bytes each time', () => {
      const bytes1 = getRandomBytes(16);
      const bytes2 = getRandomBytes(16);
      expect(Buffer.from(bytes1).toString('hex')).not.toBe(Buffer.from(bytes2).toString('hex'));
    });

    it('should handle different lengths', () => {
      expect(getRandomBytes(4)).toHaveLength(4);
      expect(getRandomBytes(8)).toHaveLength(8);
      expect(getRandomBytes(32)).toHaveLength(32);
    });

    it('should generate cryptographically random bytes', () => {
      const bytes = getRandomBytes(100);
      const allZero = bytes.every((b) => b === 0);
      const allSame = bytes.every((b) => b === bytes[0]);
      expect(allZero).toBe(false);
      expect(allSame).toBe(false);
    });
  });

  describe('createSHA1Hash', () => {
    it('should generate consistent SHA-1 hash for same input', () => {
      const input = new Uint8Array([1, 2, 3, 4, 5]);
      const hash1 = createSHA1Hash(input);
      const hash2 = createSHA1Hash(input);
      expect(hash1).toEqual(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const input1 = new Uint8Array([1, 2, 3, 4, 5]);
      const input2 = new Uint8Array([5, 4, 3, 2, 1]);
      const hash1 = createSHA1Hash(input1);
      const hash2 = createSHA1Hash(input2);
      expect(hash1).not.toEqual(hash2);
    });

    it('should generate 20-byte (160-bit) hash', () => {
      const input = new Uint8Array([1, 2, 3]);
      const hash = createSHA1Hash(input);
      expect(hash).toHaveLength(20);
    });

    it('should handle empty input', () => {
      const input = new Uint8Array([]);
      const hash = createSHA1Hash(input);
      expect(hash).toHaveLength(20);
      // SHA-1 of empty string: da39a3ee5e6b4b0d3255bfef95601890afd80709
      expect(
        Array.from(hash)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      ).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });

    it('should handle known test vectors', () => {
      // SHA-1("abc") = a9993e364706816aba3e25717850c26c9cd0d89d
      const input = new Uint8Array([97, 98, 99]); // 'abc'
      const hash = createSHA1Hash(input);
      const hexHash = Array.from(hash)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      expect(hexHash).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
    });
  });
});

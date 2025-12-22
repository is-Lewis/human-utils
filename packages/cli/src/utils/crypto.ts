/**
 * Crypto Utilities
 *
 * Platform-agnostic crypto operations that work in both Node.js and React Native.
 * Uses conditional imports instead of dynamic requires for better security and tree-shaking.
 *
 * Note: Dynamic require() calls are intentional for runtime environment detection.
 *
 * @module utils/crypto
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Detects if we're running in a Node.js environment
 */
export const isNodeEnvironment = (): boolean => {
  return typeof process !== 'undefined' && process.versions?.node !== undefined;
};

/**
 * Gets a crypto UUID using the appropriate platform's implementation
 *
 * @returns A cryptographically secure UUID v4
 * @throws Error if crypto is not available
 */
export const getCryptoUUID = (): string => {
  if (isNodeEnvironment()) {
    try {
      // Node.js - use built-in crypto
      const crypto = require('crypto');
      return crypto.randomUUID();
    } catch (error) {
      throw new Error('Node.js crypto module not available');
    }
  } else {
    try {
      // React Native - use expo-crypto
      const Crypto = require('expo-crypto');
      return Crypto.randomUUID();
    } catch (error) {
      throw new Error('expo-crypto not available. Install with: npm install expo-crypto');
    }
  }
};

/**
 * Gets random bytes using the appropriate platform's implementation
 *
 * @param length - Number of bytes to generate
 * @returns Array of random bytes
 * @throws Error if crypto is not available
 */
export const getRandomBytes = (length: number): number[] => {
  if (isNodeEnvironment()) {
    try {
      const crypto = require('crypto');
      const buffer = crypto.randomBytes(length);
      return Array.from(buffer);
    } catch (error) {
      throw new Error('Node.js crypto module not available');
    }
  } else {
    try {
      // For React Native, generate random bytes
      const array = new Uint8Array(length);

      // Try using Web Crypto API if available
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
        return Array.from(array);
      }

      // Fallback: use randomUUID and extract bytes (not ideal but works)
      const Crypto = require('expo-crypto');
      const uuid = Crypto.randomUUID();
      const hex = uuid.replace(/-/g, '');
      const bytes = [];
      for (let i = 0; i < Math.min(length * 2, hex.length); i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
      }

      // If we need more bytes than one UUID provides, generate more
      while (bytes.length < length) {
        const additionalUuid = Crypto.randomUUID();
        const additionalHex = additionalUuid.replace(/-/g, '');
        for (let i = 0; i < additionalHex.length && bytes.length < length; i += 2) {
          bytes.push(parseInt(additionalHex.substr(i, 2), 16));
        }
      }

      return bytes.slice(0, length);
    } catch (error) {
      throw new Error('expo-crypto not available. Install with: npm install expo-crypto');
    }
  }
};

/**
 * Creates a SHA-1 hash using the appropriate platform's implementation
 *
 * @param data - Data to hash
 * @returns SHA-1 hash as byte array
 */
export const createSHA1Hash = (data: Uint8Array): Uint8Array => {
  if (isNodeEnvironment()) {
    try {
      const crypto = require('crypto');
      const hashBuffer = crypto.createHash('sha1').update(Buffer.from(data)).digest();
      return new Uint8Array(hashBuffer);
    } catch (error) {
      throw new Error('Node.js crypto module not available');
    }
  } else {
    // React Native - use pure JS implementation
    return sha1Pure(data);
  }
};

/**
 * Pure JavaScript SHA-1 implementation for React Native
 * Based on the FIPS 180-4 SHA-1 specification
 *
 * Note: SHA-1 is cryptographically broken for security purposes but is acceptable
 * for UUID v5 generation which doesn't require collision resistance for security.
 */
const sha1Pure = (data: Uint8Array): Uint8Array => {
  // Initialize hash values (SHA-1 initial constants)
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  // Pre-processing: adding padding bits
  const msgLen = data.length;
  const bitLen = msgLen * 8;

  // Pad message to 512-bit blocks
  const paddedLength = Math.ceil((msgLen + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(data);
  padded[msgLen] = 0x80; // Append bit '1'

  // Append length as 64-bit big-endian
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLength - 4, bitLen >>> 0, false);

  // Process each 512-bit block
  for (let i = 0; i < paddedLength; i += 64) {
    const w = new Uint32Array(80);

    // Break block into sixteen 32-bit big-endian words
    for (let j = 0; j < 16; j++) {
      w[j] = view.getUint32(i + j * 4, false);
    }

    // Extend the sixteen 32-bit words into eighty 32-bit words
    for (let j = 16; j < 80; j++) {
      const temp = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = (temp << 1) | (temp >>> 31);
    }

    // Initialize working variables
    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4;

    // Main loop with SHA-1 magic constants
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = ((a << 5) | (a >>> 27)) + f + e + k + w[j];
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp >>> 0;
    }

    // Add this chunk's hash to result
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  // Produce the final hash value (big-endian)
  const result = new Uint8Array(20);
  const resultView = new DataView(result.buffer);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);

  return result;
};

/**
 * UUID Generator Tool
 * 
 * Provides utilities for generating and validating Universally Unique Identifiers (UUIDs).
 * Supports UUID v1 (time-based), v4 (random), v5 (name-based SHA-1), and v7 (timestamp-based) generation.
 * 
 * @module tools/uuid-generator
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { UUIDVersion, UUID_NAMESPACES } from './types';

// Re-export types and constants
export type { UUIDVersion } from './types';
export { UUID_NAMESPACES };

/**
 * generateCryptoUUID
 * 
 * Internal helper function to generate a UUID using the appropriate platform's crypto implementation.
 * Automatically detects Node.js vs React Native environment and uses the correct library.
 * 
 * @returns A UUID v4 string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuid = generateCryptoUUID();
 * // Returns: "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
const generateCryptoUUID = (): string => {
  // Check if we're in a Node.js environment
  if (typeof process !== 'undefined' && process.versions?.node) {
    // Node.js - use built-in crypto
    const crypto = require('crypto');
    return crypto.randomUUID();
  } else {
    // React Native - use expo-crypto
    const Crypto = require('expo-crypto');
    return Crypto.randomUUID();
  }
};

/**
 * generateV7
 * 
 * Generates a UUID v7 (Unix timestamp-based with random bits).
 * Uses a 48-bit Unix timestamp in milliseconds followed by 74 random bits.
 * v7 UUIDs are sortable by creation time, making them ideal for database keys.
 * 
 * @returns A UUID v7 string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuid = generateV7();
 * // Returns: "018e4e28-1f3a-7000-8000-000000000000"
 * ```
 */
const generateV7 = (): string => {
  const timestamp = Date.now();

  // Get crypto random values
  const getRandomValues = (length: number): number[] => {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const crypto = require('crypto');
      const buffer = crypto.randomBytes(length);
      return Array.from(buffer);
    } else {
      const Crypto = require('expo-crypto');
      // For React Native, generate random bytes
      const array = new Uint8Array(length);
      // Using getRandomValues or falling back to randomUUID parsing
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
        return Array.from(array);
      }
      // Fallback: use randomUUID and extract bytes
      const uuid = Crypto.randomUUID();
      const hex = uuid.replace(/-/g, '');
      const bytes = [];
      for (let i = 0; i < length * 2; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
      }
      return bytes.slice(0, length);
    }
  };

  const randomBytes = getRandomValues(10);

  // Extract timestamp parts (48 bits = 6 bytes)
  const timestampHigh = (timestamp / 0x100000000) >>> 0;
  const timestampLow = timestamp >>> 0;

  // Format: tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
  // t = timestamp, 7 = version, y = variant (10xx), x = random

  const hex = [
    // 32-bit timestamp high
    ((timestampHigh >> 8) & 0xFFFF).toString(16).padStart(4, '0'),
    (timestampHigh & 0xFF).toString(16).padStart(2, '0') +
    ((timestampLow >> 24) & 0xFF).toString(16).padStart(2, '0'),

    // 16-bit timestamp low + version
    '7' + ((timestampLow >> 12) & 0xFFF).toString(16).padStart(3, '0'),

    // Variant (10xx) + random
    ((randomBytes[0] & 0x3F) | 0x80).toString(16).padStart(2, '0') +
    randomBytes[1].toString(16).padStart(2, '0'),

    // 48 random bits
    randomBytes.slice(2, 8).map(b => b.toString(16).padStart(2, '0')).join('')
  ];

  return hex.join('-');
};

/**
 * generateV1
 * 
 * Generates a UUID v1 (time-based with random node ID).
 * Uses current timestamp and a random node ID (for privacy instead of MAC address).
 * v1 UUIDs can be sorted by creation time but reveal timestamp information.
 * 
 * @returns A UUID v1 string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuid = generateV1();
 * // Returns: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 * ```
 */
const generateV1 = (): string => {
  // UUID v1 uses 100-nanosecond intervals since October 15, 1582
  const GREGORIAN_OFFSET = 0x01B21DD213814000n;

  // Get current timestamp in 100-nanosecond intervals
  const now = Date.now();
  const timestamp = BigInt(now) * 10000n + GREGORIAN_OFFSET;

  // Extract timestamp components
  const timeLow = Number(timestamp & 0xFFFFFFFFn);
  const timeMid = Number((timestamp >> 32n) & 0xFFFFn);
  const timeHi = Number((timestamp >> 48n) & 0x0FFFn);

  // Generate random clock sequence (14 bits)
  const clockSeq = Math.floor(Math.random() * 0x4000);

  // Generate random node (48 bits) - using random instead of MAC for privacy
  const node = new Array(6).fill(0).map(() => Math.floor(Math.random() * 256));
  // Set multicast bit to indicate this is not a real MAC address
  node[0] |= 0x01;

  // Format: tttttttt-tttt-1ttt-yxxx-xxxxxxxxxxxx
  return [
    timeLow.toString(16).padStart(8, '0'),
    timeMid.toString(16).padStart(4, '0'),
    ((timeHi & 0x0FFF) | 0x1000).toString(16).padStart(4, '0'),
    ((clockSeq & 0x3FFF) | 0x8000).toString(16).padStart(4, '0'),
    node.map(b => b.toString(16).padStart(2, '0')).join('')
  ].join('-');
};

/**
 * SHA-1 hash implementation for React Native
 * Based on the FIPS 180-4 SHA-1 specification
 */
const sha1 = (data: Uint8Array): Uint8Array => {
  // Initialize hash values
  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;

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
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    
    // Main loop
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5A827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
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

/**
 * generateV5
 * 
 * Generates a UUID v5 (name-based using SHA-1 hash).
 * Creates a deterministic UUID from a namespace and name.
 * Same namespace + name always produces the same UUID.
 * 
 * @param namespace - UUID namespace (use UUID_NAMESPACES constants or custom UUID)
 * @param name - The name to hash
 * @returns A UUID v5 string
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuid = generateV5(UUID_NAMESPACES.DNS, 'example.com');
 * // Always returns: "cfbff0d1-9375-5685-968c-48ce8b15ae17"
 * ```
 */
export const generateV5 = (namespace: string, name: string): string => {
  // Convert namespace UUID to bytes
  const namespaceBytes = namespace.replace(/-/g, '').match(/.{2}/g)!.map(byte => parseInt(byte, 16));

  // Convert name to bytes
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);

  // Concatenate namespace + name
  const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
  data.set(namespaceBytes);
  data.set(nameBytes, namespaceBytes.length);

  // Create SHA-1 hash
  let hash: number[];
  
  if (typeof process !== 'undefined' && process.versions?.node) {
    // Node.js - use built-in crypto
    const crypto = require('crypto');
    const hashBuffer = crypto.createHash('sha1').update(Buffer.from(data)).digest();
    hash = Array.from(hashBuffer);
  } else {
    // React Native - use pure JS implementation
    const hashArray = sha1(data);
    hash = Array.from(hashArray);
  }

  // Set version (5) and variant bits
  hash[6] = (hash[6] & 0x0F) | 0x50; // Version 5
  hash[8] = (hash[8] & 0x3F) | 0x80; // Variant 10xx

  // Format as UUID
  const hex = hash.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
};

/**
 * generateUUID
 * 
 * Generates a single Universally Unique Identifier (UUID) of the specified version.
 * Supports v1, v4, v5, and v7. For v5, use generateV5() directly with namespace and name.
 * 
 * @param version - The UUID version to generate ('v1', 'v4', 'v5', 'v7')
 * @returns A UUID string in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * @throws {Error} If an unsupported UUID version is requested or v5 is called without parameters
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuid = generateUUID('v4');
 * // Returns: "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export const generateUUID = (version: UUIDVersion = 'v4'): string => {
  switch (version) {
    case 'v4':
      return generateCryptoUUID();
    case 'v7':
      return generateV7();
    case 'v1':
      return generateV1();
    case 'v5':
      throw new Error('UUID v5 requires namespace and name. Use generateV5() instead.');
    default:
      return generateCryptoUUID();
  }
};

/**
 * generateMultiple
 * 
 * Generates an array of UUIDs of the specified count and version.
 * Useful for bulk UUID generation in a single operation.
 * 
 * @param count - The number of UUIDs to generate (must be >= 1)
 * @param version - The UUID version to generate (defaults to 'v4')
 * @returns An array of UUID strings
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * const uuids = generateMultiple(3);
 * // Returns: ["uuid1", "uuid2", "uuid3"]
 * ```
 */
export const generateMultiple = (count: number, version: UUIDVersion = 'v4'): string[] => {
  return Array.from({ length: count }, () => generateUUID(version));
};

/**
 * isValidUUID
 * 
 * Checks whether a given string matches the standard UUID format.
 * Supports UUID versions 1-5.
 * 
 * @param uuid - The string to validate
 * @returns True if the string matches UUID format, false otherwise
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 * 
 * @example
 * ```typescript
 * isValidUUID("550e8400-e29b-41d4-a716-446655440000"); // true
 * isValidUUID("not-a-uuid"); // false
 * ```
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};


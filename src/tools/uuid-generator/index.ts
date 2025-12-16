/**
 * UUID Generator Tool
 * 
 * Provides utilities for generating and validating Universally Unique Identifiers (UUIDs).
 * Supports UUID v4 (random) generation with plans to support additional versions in the future.
 * 
 * @module tools/uuid-generator
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { UUIDVersion } from './types';

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
 * generateUUID
 * 
 * Generates a single Universally Unique Identifier (UUID) of the specified version.
 * Currently only UUID v4 (random) is supported. Other versions will throw an error.
 * 
 * @param version - The UUID version to generate (currently only 'v4' is supported)
 * @returns A UUID string in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * @throws {Error} If an unsupported UUID version is requested
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
    case 'v1':
      // TODO: Implement v1 when needed
      throw new Error('UUID v1 not yet implemented');
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


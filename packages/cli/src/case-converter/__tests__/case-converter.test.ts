/**
 * Case Converter Tests
 * 
 * This file contains unit tests for the Case Converter tool, it covers all case conversion functions
 * and ensures that various input cases are correctly converted to the desired output formats.
 *
 * @module tools/case-converter/__tests__
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toSentenceCase,
  toLowerCase,
  toUpperCase,
  detectCase,
  convertCase,
} from '../index';

describe('Case Converter', () => {
  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      const result = toCamelCase('hello_world_example');
      expect(result.success).toBe(true);
      expect(result.output).toBe('helloWorldExample');
    });

    it('should convert kebab-case to camelCase', () => {
      const result = toCamelCase('hello-world-example');
      expect(result.success).toBe(true);
      expect(result.output).toBe('helloWorldExample');
    });

    it('should handle empty input', () => {
      const result = toCamelCase('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('toPascalCase', () => {
    it('should convert snake_case to PascalCase', () => {
      const result = toPascalCase('hello_world_example');
      expect(result.success).toBe(true);
      expect(result.output).toBe('HelloWorldExample');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      const result = toSnakeCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('hello_world_example');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      const result = toKebabCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('hello-world-example');
    });
  });

  describe('toConstantCase', () => {
    it('should convert to CONSTANT_CASE', () => {
      const result = toConstantCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('HELLO_WORLD_EXAMPLE');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to Title Case', () => {
      const result = toTitleCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello World Example');
    });
  });

  describe('toSentenceCase', () => {
    it('should convert to Sentence case', () => {
      const result = toSentenceCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('Hello world example');
    });
  });

  describe('toLowerCase', () => {
    it('should convert to lowercase', () => {
      const result = toLowerCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('helloworldexample');
    });
  });

  describe('toUpperCase', () => {
    it('should convert to UPPERCASE', () => {
      const result = toUpperCase('helloWorldExample');
      expect(result.success).toBe(true);
      expect(result.output).toBe('HELLOWORLDEXAMPLE');
    });
  });

  describe('detectCase', () => {
    it('should detect camelCase', () => {
      expect(detectCase('helloWorld')).toBe('camelCase');
    });

    it('should detect snake_case', () => {
      expect(detectCase('hello_world')).toBe('snake_case');
    });

    it('should detect kebab-case', () => {
      expect(detectCase('hello-world')).toBe('kebab-case');
    });
  });

  describe('convertCase', () => {
    it('should convert using the wrapper function', () => {
      const result = convertCase('hello_world', 'camelCase');
      expect(result.success).toBe(true);
      expect(result.output).toBe('helloWorld');
    });
  });
});

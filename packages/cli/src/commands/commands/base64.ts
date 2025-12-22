/**
 * Base64 CLI Command
 *
 * Command-line interface for Base64 encoding and decoding utilities.
 *
 * @module cli/commands/base64
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { encodeToBase64, decodeFromBase64, isValidBase64 } from '../../base64-encoder';
import * as fs from 'fs';
import * as path from 'path';

export const base64Command = new Command('base64')
  .description('Encode and decode Base64')
  .argument('[operation]', 'Operation: encode or decode (e = encode, d = decode)')
  .argument('[text]', 'Text to encode/decode')
  .option('-f, --file <path>', 'Read input from file')
  .option('-o, --output <path>', 'Write output to file')
  .option('-u, --url-safe', 'Use URL-safe Base64 (encode only)')
  .addHelpText(
    'after',
    `
Examples:
  $ hu base64 encode "Hello World"       # Encode text
  $ hu base64 e "Hello"                  # Short alias
  $ hu base64 decode SGVsbG8=            # Decode text
  $ hu base64 d SGVsbG8=                 # Short alias
  $ hu base64 encode -f input.txt -o encoded.txt
  $ hu base64 decode -f encoded.txt
`
  )
  .action((operation: string | undefined, text: string | undefined, options) => {
    if (!operation) {
      console.error('Error: Please specify operation (encode/e or decode/d)');
      console.error('Example: hu base64 encode "Hello World"');
      process.exit(1);
    }

    const isEncode = operation === 'encode' || operation === 'e';
    const isDecode = operation === 'decode' || operation === 'd';

    if (!isEncode && !isDecode) {
      console.error(`Error: Invalid operation "${operation}". Use encode/e or decode/d`);
      process.exit(1);
    }

    try {
      let inputText = text || '';

      // Read from file if specified
      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`Error: File not found: ${filePath}`);
          process.exit(1);
        }
        inputText = fs.readFileSync(filePath, 'utf-8');
      } else if (!text) {
        console.error('Error: Please provide text or use -f to specify a file');
        console.error(`Example: hu base64 ${operation} "text here"`);
        process.exit(1);
      }

      const result = isEncode
        ? encodeToBase64(inputText, { urlSafe: options.urlSafe })
        : decodeFromBase64(inputText);

      // Write to file if specified
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, result, 'utf-8');
        console.log(`✓ ${isEncode ? 'Encoded' : 'Decoded'} and saved to: ${outputPath}`);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Validate command
base64Command
  .command('validate <text>')
  .description('Check if text is valid Base64')
  .action((text: string) => {
    const isValid = isValidBase64(text);

    if (isValid) {
      console.log('\n✓ Valid Base64 format');
      process.exit(0);
    } else {
      console.log('\n✗ Invalid Base64 format');
      process.exit(1);
    }
  });

/**
 * Base64 CLI Command
 * 
 * Command-line interface for Base64 encoding and decoding utilities.
 * 
 * @module cli/commands/base64
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { encodeToBase64, decodeFromBase64, isValidBase64 } from '../../src/tools/base64-encoder';

export const base64Command = new Command('base64')
  .description('Base64 encoding and decoding utilities');

// Encode command
base64Command
  .command('encode <text>')
  .description('Encode text to Base64')
  .action((text: string) => {
    try {
      const encoded = encodeToBase64(text);
      console.log('\n✓ Encoded:');
      console.log(encoded);
      console.log(`\nInput size: ${text.length} characters`);
      console.log(`Output size: ${encoded.length} characters`);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Decode command
base64Command
  .command('decode <base64>')
  .description('Decode Base64 to text')
  .action((base64Text: string) => {
    try {
      if (!isValidBase64(base64Text)) {
        console.error('\n✗ Error: Invalid Base64 format');
        process.exit(1);
      }
      
      const decoded = decodeFromBase64(base64Text);
      console.log('\n✓ Decoded:');
      console.log(decoded);
      console.log(`\nInput size: ${base64Text.length} characters`);
      console.log(`Output size: ${decoded.length} characters`);
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

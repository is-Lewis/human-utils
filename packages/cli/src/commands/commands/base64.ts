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
  .description('Base64 encoding and decoding utilities');

// Encode command
base64Command
  .command('encode [text]')
  .description('Encode text to Base64')
  .option('-f, --file <path>', 'Read input from file')
  .option('-o, --output <path>', 'Write output to file')
  .option('-u, --url-safe', 'Use URL-safe Base64 encoding')
  .action((text: string | undefined, options: { file?: string; output?: string; urlSafe?: boolean }) => {
    try {
      let inputText = text || '';
      
      // Read from file if specified
      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`\n✗ Error: File not found: ${filePath}`);
          process.exit(1);
        }
        inputText = fs.readFileSync(filePath, 'utf-8');
        console.log(`\n📄 Reading from: ${filePath}`);
      } else if (!text) {
        console.error('\n✗ Error: Please provide text or use -f to specify a file');
        process.exit(1);
      }
      
      const encoded = encodeToBase64(inputText, { urlSafe: options.urlSafe });
      
      // Write to file if specified
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, encoded, 'utf-8');
        console.log(`\n✓ Encoded and saved to: ${outputPath}`);
      } else {
        console.log('\n✓ Encoded:');
        console.log(encoded);
      }
      
      console.log(`\nInput size: ${inputText.length} characters`);
      console.log(`Output size: ${encoded.length} characters`);
      if (options.urlSafe) {
        console.log('Mode: URL-safe Base64');
      }
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Decode command
base64Command
  .command('decode [base64]')
  .description('Decode Base64 to text')
  .option('-f, --file <path>', 'Read input from file')
  .option('-o, --output <path>', 'Write output to file')
  .action((base64Text: string | undefined, options: { file?: string; output?: string }) => {
    try {
      let inputText = base64Text || '';
      
      // Read from file if specified
      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`\n✗ Error: File not found: ${filePath}`);
          process.exit(1);
        }
        inputText = fs.readFileSync(filePath, 'utf-8').trim();
        console.log(`\n📄 Reading from: ${filePath}`);
      } else if (!base64Text) {
        console.error('\n✗ Error: Please provide Base64 text or use -f to specify a file');
        process.exit(1);
      }
      
      if (!isValidBase64(inputText)) {
        console.error('\n✗ Error: Invalid Base64 format');
        process.exit(1);
      }
      
      const decoded = decodeFromBase64(inputText);
      
      // Write to file if specified
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, decoded, 'utf-8');
        console.log(`\n✓ Decoded and saved to: ${outputPath}`);
      } else {
        console.log('\n✓ Decoded:');
        console.log(decoded);
      }
      
      console.log(`\nInput size: ${inputText.length} characters`);
      console.log(`Output size: ${decoded.length} characters`);
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

/**
 * JSON CLI Command
 *
 * Command-line interface for JSON formatting and validation utilities.
 *
 * @module cli/commands/json
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { formatJson, minifyJson, validateJson } from '../../json-formatter';
import * as fs from 'fs';
import * as path from 'path';

export const jsonCommand = new Command('json').description(
  'JSON formatting and validation utilities'
);

// Format command
jsonCommand
  .command('format [json]')
  .description('Format JSON with pretty printing')
  .option('-f, --file <path>', 'Read input from file')
  .option('-o, --output <path>', 'Write output to file')
  .option('-i, --indent <size>', 'Indentation size (2 or 4)', '2')
  .option('-s, --sort-keys', 'Sort object keys alphabetically')
  .option('-u, --escape-unicode', 'Escape unicode characters')
  .action(
    (
      json: string | undefined,
      options: {
        file?: string;
        output?: string;
        indent?: string;
        sortKeys?: boolean;
        escapeUnicode?: boolean;
      }
    ) => {
      try {
        let inputText = json || '';

        // Read from file if specified
        if (options.file) {
          const filePath = path.resolve(options.file);
          if (!fs.existsSync(filePath)) {
            console.error(`\n✗ Error: File not found: ${filePath}`);
            process.exit(1);
          }
          inputText = fs.readFileSync(filePath, 'utf-8');
          console.log(`\n📄 Reading from: ${filePath}`);
        } else if (!json) {
          console.error('\n✗ Error: Please provide JSON or use -f to specify a file');
          process.exit(1);
        }

        const indentSize = parseInt(options.indent || '2', 10);
        if (indentSize !== 2 && indentSize !== 4) {
          console.error('\n✗ Error: Indent size must be 2 or 4');
          process.exit(1);
        }

        const result = formatJson(inputText, {
          indentSize: indentSize as 2 | 4,
          sortKeys: options.sortKeys,
          escapeUnicode: options.escapeUnicode,
        });

        if (!result.success) {
          console.error(`\n✗ Error: ${result.error}`);
          process.exit(1);
        }

        // Write to file if specified
        if (options.output) {
          const outputPath = path.resolve(options.output);
          fs.writeFileSync(outputPath, result.output!, 'utf-8');
          console.log(`\n✓ Formatted and saved to: ${outputPath}`);
        } else {
          console.log('\n✓ Formatted JSON:');
          console.log(result.output);
        }

        console.log(`\nOriginal size: ${result.originalSize} bytes`);
        console.log(`Formatted size: ${result.formattedSize} bytes`);
        if (options.sortKeys) console.log('Keys sorted: Yes');
        if (options.escapeUnicode) console.log('Unicode escaped: Yes');
      } catch (error) {
        console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    }
  );

// Minify command
jsonCommand
  .command('minify [json]')
  .description('Minify JSON by removing whitespace')
  .option('-f, --file <path>', 'Read input from file')
  .option('-o, --output <path>', 'Write output to file')
  .action((json: string | undefined, options: { file?: string; output?: string }) => {
    try {
      let inputText = json || '';

      // Read from file if specified
      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`\n✗ Error: File not found: ${filePath}`);
          process.exit(1);
        }
        inputText = fs.readFileSync(filePath, 'utf-8');
        console.log(`\n📄 Reading from: ${filePath}`);
      } else if (!json) {
        console.error('\n✗ Error: Please provide JSON or use -f to specify a file');
        process.exit(1);
      }

      const result = minifyJson(inputText);

      if (!result.success) {
        console.error(`\n✗ Error: ${result.error}`);
        process.exit(1);
      }

      // Write to file if specified
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, result.output!, 'utf-8');
        console.log(`\n✓ Minified and saved to: ${outputPath}`);
      } else {
        console.log('\n✓ Minified JSON:');
        console.log(result.output);
      }

      console.log(`\nOriginal size: ${result.originalSize} bytes`);
      console.log(`Minified size: ${result.formattedSize} bytes`);
      console.log(
        `Reduction: ${((1 - result.formattedSize! / result.originalSize!) * 100).toFixed(1)}%`
      );
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Validate command
jsonCommand
  .command('validate [json]')
  .description('Validate JSON syntax')
  .option('-f, --file <path>', 'Read input from file')
  .action((json: string | undefined, options: { file?: string }) => {
    try {
      let inputText = json || '';

      // Read from file if specified
      if (options.file) {
        const filePath = path.resolve(options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`\n✗ Error: File not found: ${filePath}`);
          process.exit(1);
        }
        inputText = fs.readFileSync(filePath, 'utf-8');
        console.log(`\n📄 Reading from: ${filePath}`);
      } else if (!json) {
        console.error('\n✗ Error: Please provide JSON or use -f to specify a file');
        process.exit(1);
      }

      const result = validateJson(inputText);

      if (result.valid) {
        console.log('\n✓ Valid JSON');
        process.exit(0);
      } else {
        console.log('\n✗ Invalid JSON');
        console.log(`Error: ${result.error}`);
        if (result.errorLine) {
          console.log(`Line: ${result.errorLine}, Column: ${result.errorColumn}`);
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

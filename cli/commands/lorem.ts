/**
 * Lorem Ipsum CLI Command
 * 
 * Command-line interface for lorem ipsum generation.
 * 
 * @module cli/commands/lorem
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { generateWords, generateSentences, generateParagraphs } from '../../src/tools/lorem-ipsum';
import * as fs from 'fs';
import * as path from 'path';

export const loremCommand = new Command('lorem')
  .description('Lorem ipsum placeholder text generator');

// Words command
loremCommand
  .command('words [count]')
  .description('Generate lorem ipsum words')
  .option('-s, --start-with-lorem', 'Start with "Lorem ipsum"')
  .option('-o, --output <path>', 'Write output to file')
  .action((countStr: string = '50', options: { startWithLorem?: boolean; output?: string }) => {
    try {
      const count = parseInt(countStr, 10);
      
      if (isNaN(count) || count < 1) {
        console.error('\n✗ Error: Count must be a positive number');
        process.exit(1);
      }
      
      const text = generateWords(count, options.startWithLorem);
      
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, text, 'utf-8');
        console.log(`\n✓ Generated and saved to: ${outputPath}`);
      } else {
        console.log(`\n${text}`);
      }
      
      console.log(`\nGenerated: ${count} words`);
      if (options.startWithLorem) console.log('Started with: Lorem ipsum');
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Sentences command
loremCommand
  .command('sentences [count]')
  .description('Generate lorem ipsum sentences')
  .option('-s, --start-with-lorem', 'Start with "Lorem ipsum"')
  .option('-o, --output <path>', 'Write output to file')
  .action((countStr: string = '5', options: { startWithLorem?: boolean; output?: string }) => {
    try {
      const count = parseInt(countStr, 10);
      
      if (isNaN(count) || count < 1) {
        console.error('\n✗ Error: Count must be a positive number');
        process.exit(1);
      }
      
      const text = generateSentences(count, options.startWithLorem);
      
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, text, 'utf-8');
        console.log(`\n✓ Generated and saved to: ${outputPath}`);
      } else {
        console.log(`\n${text}`);
      }
      
      console.log(`\nGenerated: ${count} sentences`);
      if (options.startWithLorem) console.log('Started with: Lorem ipsum');
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Paragraphs command
loremCommand
  .command('paragraphs [count]')
  .alias('p')
  .description('Generate lorem ipsum paragraphs')
  .option('-s, --start-with-lorem', 'Start with "Lorem ipsum"')
  .option('-H, --html', 'Wrap paragraphs in <p> tags')
  .option('-o, --output <path>', 'Write output to file')
  .action((countStr: string = '3', options: { startWithLorem?: boolean; html?: boolean; output?: string }) => {
    try {
      const count = parseInt(countStr, 10);
      
      if (isNaN(count) || count < 1) {
        console.error('\n✗ Error: Count must be a positive number');
        process.exit(1);
      }
      
      const text = generateParagraphs(count, options.startWithLorem, options.html);
      
      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, text, 'utf-8');
        console.log(`\n✓ Generated and saved to: ${outputPath}`);
      } else {
        console.log(`\n${text}`);
      }
      
      console.log(`\nGenerated: ${count} paragraphs`);
      if (options.startWithLorem) console.log('Started with: Lorem ipsum');
      if (options.html) console.log('Format: HTML <p> tags');
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

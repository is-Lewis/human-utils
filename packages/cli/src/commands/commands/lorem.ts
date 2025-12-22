/**
 * Lorem Ipsum CLI Command
 *
 * Command-line interface for lorem ipsum generation.
 *
 * @module cli/commands/lorem
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { generateLorem } from '../../lorem-ipsum';
import * as fs from 'fs';
import * as path from 'path';

export const loremCommand = new Command('lorem')
  .description('Generate Lorem Ipsum placeholder text')
  .argument('[count]', 'Number of units to generate', '50')
  .option('-u, --unit <type>', 'Unit type: words, sentences, paragraphs (w/s/p)', 'words')
  .option('-s, --start-with-lorem', 'Start with "Lorem ipsum dolor sit amet"')
  .option('--html', 'Wrap paragraphs in <p> tags')
  .option('-o, --output <path>', 'Write output to file')
  .addHelpText(
    'after',
    `
Examples:
  $ hu lorem                      # 50 words (default)
  $ hu lorem 100                  # 100 words
  $ hu lorem 5 -u sentences       # 5 sentences
  $ hu lorem 3 -u s               # 3 sentences (short alias)
  $ hu lorem 3 -u paragraphs --html  # 3 paragraphs with <p> tags
  $ hu lorem 10 -u p -s           # 10 paragraphs starting with Lorem ipsum
  
Aliases:
  $ hu lorem words 50             # Same as 'hu lorem 50'
  $ hu lorem sentences 5          # Same as 'hu lorem 5 -u s'
  $ hu lorem paragraphs 3         # Same as 'hu lorem 3 -u p'
`
  )
  .action((countStr: string, options) => {
    try {
      const count = parseInt(countStr, 10);

      if (isNaN(count) || count < 1) {
        console.error('Error: Count must be a positive number');
        process.exit(1);
      }

      // Normalize unit
      let unit: 'words' | 'sentences' | 'paragraphs' = 'words';
      if (options.unit === 'sentences' || options.unit === 's') {
        unit = 'sentences';
      } else if (options.unit === 'paragraphs' || options.unit === 'p') {
        unit = 'paragraphs';
      }

      const result = generateLorem({
        count,
        unit,
        startWithLorem: options.startWithLorem,
        htmlParagraphs: options.html,
      });

      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, result.text, 'utf-8');
        console.log(`✓ Generated and saved to: ${outputPath}`);
        console.log(`${result.wordCount} words, ${result.paragraphCount} paragraphs`);
      } else {
        console.log(result.text);
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

/**
 * UUID CLI Command
 * 
 * Command-line interface for UUID generation and validation utilities.
 * 
 * @module cli/commands/uuid
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { generateUUID, generateMultiple, isValidUUID } from '../../src/tools/uuid-generator';

export const uuidCommand = new Command('uuid')
  .description('UUID generation and validation utilities');

// Generate command
uuidCommand
  .command('generate')
  .description('Generate one or more UUIDs')
  .option('-c, --count <number>', 'Number of UUIDs to generate', '1')
  .option('-v, --version <version>', 'UUID version (v4, v1)', 'v4')
  .action((options) => {
    try {
      const count = parseInt(options.count);
      
      // Validate count
      if (isNaN(count) || count < 1) {
        console.error('Error: Count must be a positive number');
        process.exit(1);
      }

      if (count > 10000) {
        console.error('Error: Count cannot exceed 10,000');
        process.exit(1);
      }

      // Generate UUIDs
      if (count === 1) {
        console.log(generateUUID(options.version));
      } else {
        const uuids = generateMultiple(count, options.version);
        uuids.forEach(uuid => console.log(uuid));
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Validate command
uuidCommand
  .command('validate <uuid>')
  .description('Validate a UUID format')
  .action((uuid: string) => {
    const valid = isValidUUID(uuid);
    
    if (valid) {
      console.log('✓ Valid UUID');
      process.exit(0);
    } else {
      console.log('✗ Invalid UUID');
      process.exit(1);
    }
  });

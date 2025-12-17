/**
 * UUID CLI Command
 * 
 * Command-line interface for UUID generation and validation utilities.
 * 
 * @module cli/commands/uuid
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { generateUUID, generateMultiple, generateV5, isValidUUID } from '../../src/tools/uuid-generator';
import { UUID_NAMESPACES } from '../../src/tools/uuid-generator/types';

export const uuidCommand = new Command('uuid')
  .description('UUID generation and validation utilities');

// Generate command
uuidCommand
  .command('generate')
  .description('Generate one or more UUIDs')
  .option('-c, --count <number>', 'Number of UUIDs to generate', '1')
  .option('-v, --version <version>', 'UUID version (v1, v4, v5, v7)', 'v4')
  .option('-n, --namespace <namespace>', 'Namespace for v5 (DNS, URL, OID, X500, or custom UUID)')
  .option('--name <name>', 'Name for v5 UUID generation')
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

      // Handle v5 special case
      if (options.version === 'v5') {
        if (!options.namespace || !options.name) {
          console.error('Error: UUID v5 requires both --namespace and --name options');
          console.error('Example: hu uuid generate -v v5 --namespace DNS --name example.com');
          process.exit(1);
        }
        
        // Resolve namespace
        let namespace = options.namespace;
        if (UUID_NAMESPACES[options.namespace.toUpperCase() as keyof typeof UUID_NAMESPACES]) {
          namespace = UUID_NAMESPACES[options.namespace.toUpperCase() as keyof typeof UUID_NAMESPACES];
        }
        
        // Generate v5 UUIDs
        for (let i = 0; i < count; i++) {
          console.log(generateV5(namespace, options.name));
        }
        return;
      }

      // Generate standard UUIDs
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

/**
 * UUID CLI Command
 *
 * Command-line interface for UUID generation and validation utilities.
 *
 * @module cli/commands/uuid
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { generateUUID, generateMultiple, generateV5, isValidUUID } from '../../uuid-generator';
import { UUID_NAMESPACES, UUIDVersion } from '../../uuid-generator/types';

export const uuidCommand = new Command('uuid')
  .description('Generate and validate UUIDs')
  .argument('[version]', 'UUID version (v1, v4, v5, v7)', 'v4')
  .option('-c, --count <number>', 'Number of UUIDs to generate', '1')
  .option('-n, --namespace <namespace>', 'Namespace for v5 (DNS, URL, OID, X500)')
  .option('--name <name>', 'Name for v5 UUID generation')
  .addHelpText(
    'after',
    `
Examples:
  $ hu uuid                    # Generate UUID v4 (random)
  $ hu uuid v7                 # Generate UUID v7 (timestamp-sortable)
  $ hu uuid v1 -c 5            # Generate 5 UUID v1 (time-based)
  $ hu uuid v5 example.com -n DNS   # Generate v5 from domain name
  
Aliases:
  $ hu uuid generate           # Same as 'hu uuid'
  $ hu uuid validate <uuid>    # Check if UUID is valid
`
  )
  .action((version: string, options) => {
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
      if (version === 'v5') {
        if (!options.namespace || !options.name) {
          console.error('Error: UUID v5 requires both --namespace and --name');
          console.error('Example: hu uuid v5 example.com --namespace DNS');
          process.exit(1);
        }

        // Resolve namespace
        let namespace = options.namespace;
        const nsKey = options.namespace.toUpperCase() as keyof typeof UUID_NAMESPACES;
        if (UUID_NAMESPACES[nsKey]) {
          namespace = UUID_NAMESPACES[nsKey];
        }

        // Generate v5 UUIDs
        for (let i = 0; i < count; i++) {
          console.log(generateV5(namespace, options.name));
        }
        return;
      }

      // Generate standard UUIDs
      if (count === 1) {
        console.log(generateUUID(version as UUIDVersion));
      } else {
        const uuids = generateMultiple(count, version as UUIDVersion);
        uuids.forEach((uuid) => console.log(uuid));
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Validate command
uuidCommand
  .command('validate')
  .alias('check')
  .description('Validate a UUID format')
  .argument('<uuid>', 'UUID to validate')
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

#!/usr/bin/env node

/**
 * HumanUtils CLI Entry Point
 *
 * Command-line interface for HumanUtils developer utilities.
 * Provides access to all tools via terminal commands.
 *
 * @module cli
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Command } from 'commander';
import { uuidCommand } from './commands/commands/uuid';
import { base64Command } from './commands/commands/base64';
import { jsonCommand } from './commands/commands/json';
import { loremCommand } from './commands/commands/lorem';

const program = new Command();

program
  .name('hu')
  .description('HumanUtils - Everyday utilities for everyone')
  .version('1.0.0')
  .addHelpText(
    'after',
    `
Examples:
  $ hu uuid                                    # Quick UUID v4
  $ hu uuid v5 example.com --namespace DNS     # Deterministic UUID
  $ hu base64 encode "Hello World"             # Encode text
  $ hu json format input.json                  # Format JSON file
  $ hu lorem 50                                # 50 words of Lorem Ipsum
  
Get help for any command:
  $ hu <command> --help
`
  );

// Register commands
program.addCommand(uuidCommand);
program.addCommand(base64Command);
program.addCommand(jsonCommand);
program.addCommand(loremCommand);

// Parse command line arguments
program.parse();

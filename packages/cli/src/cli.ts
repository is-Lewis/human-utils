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
  .description('HumanUtils CLI - Developer utilities in your terminal')
  .version('1.0.0');

// Register commands
program.addCommand(uuidCommand);
program.addCommand(base64Command);
program.addCommand(jsonCommand);
program.addCommand(loremCommand);

// Parse command line arguments
program.parse();

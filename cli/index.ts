#!/usr/bin/env -S npx tsx

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
import { uuidCommand } from './commands/uuid';

const program = new Command();

program
  .name('hu')
  .description('HumanUtils CLI - Developer utilities in your terminal')
  .version('1.0.0');

// Register commands
program.addCommand(uuidCommand);

// Parse command line arguments
program.parse();

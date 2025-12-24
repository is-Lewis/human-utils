/**
 * Text Counter Types
 *
 * Type definitions for the text counter tool.
 *
 * @module tools/text-counter/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { HistoryEntry } from '../utils/types';

/**
 * Text statistics result
 */
export interface TextStats {
  /** Total character count (including spaces) */
  characters: number;
  /** Character count excluding spaces */
  charactersNoSpaces: number;
  /** Word count */
  words: number;
  /** Line count */
  lines: number;
  /** Sentence count */
  sentences: number;
  /** Paragraph count */
  paragraphs: number;
  /** Average word length */
  averageWordLength: number;
  /** Reading time in minutes (based on 200 words per minute) */
  readingTime: number;
}

/**
 * History entry for text counting
 */
export interface TextCounterHistoryEntry extends HistoryEntry {
  /** Input text */
  input: string;
  /** Calculated statistics */
  stats: TextStats;
}

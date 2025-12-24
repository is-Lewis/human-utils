/**
 * Text Counter Core Functions
 *
 * Provides text analysis functionality including character, word, line,
 * sentence, and paragraph counting.
 *
 * @module tools/text-counter
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { TextStats } from './types';

// Re-export types
export type { TextStats, TextCounterHistoryEntry } from './types';

/**
 * Counts various text statistics.
 *
 * Analyzes text and returns counts for characters, words, lines, sentences,
 * paragraphs, and other metrics.
 *
 * @param input - The text to analyze
 * @returns Text statistics
 *
 * @example
 * ```ts
 * const stats = countText('Hello world!\nThis is a test.');
 * console.log(stats.words); // 6
 * console.log(stats.lines); // 2
 * ```
 */
export function countText(input: string): TextStats {
    const characters: number = input.length;
    let charactersNoSpaces: number = 0;

    for (var i = 0, len = input.length; i < len; i++)
    {
        if (input[i] !== ' ')
        {
            charactersNoSpaces++;
        }
    };

    

    return {
        characters,
        charactersNoSpaces,
        words: 0,
        lines: 0,
        sentences: 0,
        paragraphs: 0,
        averageWordLength: 0,
        readingTime: 0,
    };
}

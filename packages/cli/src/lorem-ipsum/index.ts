/**
 * Lorem Ipsum Generator Core Functions
 * 
 * @module tools/lorem-ipsum
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { LoremOptions, LoremResult, LoremUnit } from './types';

// Re-export types
export type { LoremOptions, LoremResult, LoremUnit } from './types';

// Lorem ipsum word bank (extended version)
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'semper', 'tellus',
  'mauris', 'pharetra', 'convallis', 'posuere', 'morbi', 'leo', 'urna', 'molestie',
  'erat', 'hendrerit', 'gravida', 'rutrum', 'quisque', 'integer', 'feugiat',
  'scelerisque', 'varius', 'accumsan', 'lacus', 'vel', 'facilisis', 'volutpat',
  'nunc', 'pulvinar', 'sapien', 'ligula', 'rhoncus', 'mattis', 'imperdiet',
  'proin', 'fermentum', 'leo', 'purus', 'sodales', 'neque', 'libero', 'venenatis',
  'faucibus', 'ornare', 'suspendisse', 'potenti', 'nullam', 'porttitor', 'lacus',
  'luctus', 'accumsan', 'tortor', 'risus', 'viverra', 'adipiscing', 'bibendum',
  'arcu', 'vitae', 'elementum', 'curabitur', 'nunc', 'sed', 'blandit', 'libero'
];

const LOREM_START = 'Lorem ipsum dolor sit amet';

/**
 * Generates a random word from the lorem ipsum bank
 */
function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a single sentence (5-15 words)
 */
function generateSentence(startWithLorem: boolean = false): string {
  const wordCount = Math.floor(Math.random() * 11) + 5; // 5-15 words
  const words: string[] = [];
  
  if (startWithLorem && words.length === 0) {
    return LOREM_START + '.';
  }
  
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomWord());
  }
  
  // Capitalize first word and add period
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

/**
 * Generates a paragraph (3-7 sentences)
 */
function generateParagraph(startWithLorem: boolean = false): string {
  const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences
  const sentences: string[] = [];
  
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(startWithLorem && i === 0));
  }
  
  return sentences.join(' ');
}

/**
 * Generates lorem ipsum text based on options
 * 
 * @param options - Generation options
 * @returns Generated lorem ipsum with statistics
 * 
 * @example
 * ```ts
 * const result = generateLorem({ count: 3, unit: 'paragraphs', startWithLorem: true });
 * console.log(result.text);
 * ```
 */
export function generateLorem(options: LoremOptions): LoremResult {
  const { count, unit, startWithLorem = true, htmlParagraphs = false } = options;
  let text = '';
  let paragraphCount = 0;
  
  switch (unit) {
    case 'words': {
      const words: string[] = [];
      if (startWithLorem) {
        words.push(...LOREM_START.split(' ').slice(0, Math.min(count, 5)));
      }
      
      while (words.length < count) {
        words.push(getRandomWord());
      }
      
      text = words.slice(0, count).join(' ');
      if (startWithLorem) {
        text = capitalize(text);
      }
      paragraphCount = 1;
      break;
    }
    
    case 'sentences': {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(startWithLorem && i === 0));
      }
      text = sentences.join(' ');
      paragraphCount = 1;
      break;
    }
    
    case 'paragraphs': {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const paragraph = generateParagraph(startWithLorem && i === 0);
        if (htmlParagraphs) {
          paragraphs.push(`<p>${paragraph}</p>`);
        } else {
          paragraphs.push(paragraph);
        }
      }
      text = paragraphs.join(htmlParagraphs ? '\n' : '\n\n');
      paragraphCount = count;
      break;
    }
  }
  
  // Calculate statistics
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;
  
  return {
    text,
    wordCount,
    charCount,
    paragraphCount
  };
}

/**
 * Quick generator for words
 */
export function generateWords(count: number, startWithLorem: boolean = false): string {
  return generateLorem({ count, unit: 'words', startWithLorem }).text;
}

/**
 * Quick generator for sentences
 */
export function generateSentences(count: number, startWithLorem: boolean = false): string {
  return generateLorem({ count, unit: 'sentences', startWithLorem }).text;
}

/**
 * Quick generator for paragraphs
 */
export function generateParagraphs(count: number, startWithLorem: boolean = false, html: boolean = false): string {
  return generateLorem({ count, unit: 'paragraphs', startWithLorem, htmlParagraphs: html }).text;
}

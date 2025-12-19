/**
 * Lorem Ipsum Generator Types
 * 
 * @module tools/lorem-ipsum/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

/**
 * Unit type for generating lorem ipsum
 */
export type LoremUnit = 'words' | 'sentences' | 'paragraphs';

/**
 * Lorem ipsum generation options
 */
export interface LoremOptions {
  /** Number of units to generate */
  count: number;
  
  /** Unit type */
  unit: LoremUnit;
  
  /** Start with "Lorem ipsum dolor sit amet" */
  startWithLorem?: boolean;
  
  /** Include HTML paragraph tags */
  htmlParagraphs?: boolean;
}

/**
 * Lorem ipsum generation result
 */
export interface LoremResult {
  /** Generated text */
  text: string;
  
  /** Word count */
  wordCount: number;
  
  /** Character count */
  charCount: number;
  
  /** Paragraph count */
  paragraphCount: number;
}

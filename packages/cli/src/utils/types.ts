/**
 * Shared Type Definitions
 *
 * Common type definitions and interfaces used across multiple tools
 * to maintain consistency and enable proper tree-shaking.
 *
 * @module utils/types
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

/**
 * Base history entry interface for tracking operations.
 *
 * Provides the foundational structure for history entries across all tools.
 * Each tool extends this interface with tool-specific properties.
 *
 * @example
 * ```ts
 * interface MyToolHistoryEntry extends HistoryEntry {
 *   input: string;
 *   output: string;
 * }
 * ```
 */
export interface HistoryEntry {
  /** Unique identifier for the history entry */
  id: string;

  /** Unix timestamp (milliseconds) when the operation occurred */
  timestamp: number;

  /** Allow additional properties for tool-specific data */
  [key: string]: unknown;
}

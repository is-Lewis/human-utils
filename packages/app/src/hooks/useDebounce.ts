/**
 * Debounce Hook
 * 
 * Hook for debouncing expensive operations like validation.
 * 
 * @module hooks/useDebounce
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { useState, useEffect } from 'react';
import { LIMITS } from '../constants/limits';

/**
 * Debounces a value by delaying updates
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [input, setInput] = useState('');
 * const debouncedInput = useDebounce(input, 300);
 * 
 * useEffect(() => {
 *   // This only runs 300ms after the user stops typing
 *   validateInput(debouncedInput);
 * }, [debouncedInput]);
 * ```
 */
export const useDebounce = <T>(
  value: T,
  delay: number = LIMITS.PERFORMANCE.VALIDATION_DEBOUNCE_MS
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

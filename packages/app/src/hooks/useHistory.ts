/**
 * History Hook
 * 
 * Generic hook for managing operation history with add, clear, and load functionality.
 * 
 * @module hooks/useHistory
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { LIMITS } from '../constants/limits';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  [key: string]: any;
}

export const useHistory = <T extends HistoryEntry>(
  maxItems: number = LIMITS.HISTORY.MAX_ITEMS
) => {
  const [history, setHistory] = useState<T[]>([]);

  /**
   * Adds an entry to history
   */
  const addToHistory = (entry: Omit<T, 'id' | 'timestamp'>): void => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    } as T;

    setHistory((prev) => [newEntry, ...prev].slice(0, maxItems));
  };

  /**
   * Clears all history with confirmation
   */
  const clearHistory = (onConfirm?: () => void): void => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            if (onConfirm) onConfirm();
          },
        },
      ]
    );
  };

  /**
   * Removes a specific history entry
   */
  const removeHistoryEntry = (id: string): void => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  /**
   * Gets a specific history entry by ID
   */
  const getHistoryEntry = (id: string): T | undefined => {
    return history.find((entry) => entry.id === id);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeHistoryEntry,
    getHistoryEntry,
  };
};

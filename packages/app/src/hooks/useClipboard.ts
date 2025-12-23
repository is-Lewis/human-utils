/**
 * Clipboard Hook
 *
 * Reusable hook for clipboard operations with consistent error handling and messaging.
 *
 * @module hooks/useClipboard
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import * as Clipboard from 'expo-clipboard';
import { Logger } from '../services/Logger';
import { showError, showSuccess } from '../utils';

export const useClipboard = () => {
  /**
   * Copies text to clipboard with success notification.
   *
   * @param text - The text to copy to clipboard
   * @param successMessage - Optional custom success message (defaults to 'Copied to clipboard')
   */
  const copy = async (
    text: string,
    successMessage: string = 'Copied to clipboard'
  ): Promise<void> => {
    try {
      await Clipboard.setStringAsync(text);
      showSuccess(successMessage);
      Logger.debug('Clipboard copy successful', { length: text.length });
    } catch (error) {
      Logger.error('Clipboard copy failed', error);
      showError('Failed to copy to clipboard');
    }
  };

  /**
   * Pastes text from clipboard.
   *
   * @returns The clipboard content as a string, or empty string on error
   */
  const paste = async (): Promise<string> => {
    try {
      const text = await Clipboard.getStringAsync();
      Logger.debug('Clipboard paste successful', { length: text.length });
      return text;
    } catch (error) {
      Logger.error('Clipboard paste failed', error);
      showError('Failed to paste from clipboard');
      return '';
    }
  };

  /**
   * Checks if clipboard has content.
   *
   * @returns True if clipboard contains text, false otherwise
   */
  const hasContent = async (): Promise<boolean> => {
    try {
      const text = await Clipboard.getStringAsync();
      return text.length > 0;
    } catch (error) {
      Logger.error('Clipboard check failed', error);
      return false;
    }
  };

  return { copy, paste, hasContent };
};

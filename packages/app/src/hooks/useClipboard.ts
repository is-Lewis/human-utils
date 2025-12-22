/**
 * Clipboard Hook
 *
 * Reusable hook for clipboard operations with consistent error handling and messaging.
 *
 * @module hooks/useClipboard
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SUCCESS_MESSAGES } from '../constants/limits';
import { Logger } from '../services/Logger';

export const useClipboard = () => {
  /**
   * Copies text to clipboard with success notification
   */
  const copy = async (
    text: string,
    successMessage: string = SUCCESS_MESSAGES.COPIED
  ): Promise<void> => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', successMessage);
      Logger.debug('Clipboard copy successful', { length: text.length });
    } catch (error) {
      Logger.error('Clipboard copy failed', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  /**
   * Pastes text from clipboard
   */
  const paste = async (): Promise<string> => {
    try {
      const text = await Clipboard.getStringAsync();
      Logger.debug('Clipboard paste successful', { length: text.length });
      return text;
    } catch (error) {
      Logger.error('Clipboard paste failed', error);
      Alert.alert('Error', 'Failed to paste from clipboard');
      return '';
    }
  };

  /**
   * Checks if clipboard has content
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

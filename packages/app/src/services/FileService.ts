/**
 * File Service
 *
 * Platform-agnostic file operations (upload, download, share).
 * Abstracts platform-specific implementations for web and mobile.
 *
 * @module services/FileService
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import { Platform, Alert, Share } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LIMITS, ERROR_MESSAGES } from '../constants/limits';
import { Logger } from './Logger';

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface FilePickResult {
  content: string;
  name: string;
  size: number;
  mimeType?: string;
}

class FileServiceClass {
  /**
   * Validates file before processing
   */
  private validateFile(
    asset: DocumentPicker.DocumentPickerAsset,
    options: FileValidationOptions = {}
  ): { valid: boolean; error?: string } {
    const maxSizeMB = options.maxSizeMB || LIMITS.FILE.MAX_SIZE_MB;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Check file size
    if (asset.size && asset.size > maxSizeBytes) {
      return {
        valid: false,
        error: ERROR_MESSAGES.FILE_TOO_LARGE(maxSizeMB),
      };
    }

    // Check MIME type if specified
    if (options.allowedTypes && asset.mimeType) {
      if (!options.allowedTypes.includes(asset.mimeType)) {
        return {
          valid: false,
          error: ERROR_MESSAGES.FILE_INVALID_TYPE(options.allowedTypes),
        };
      }
    }

    return { valid: true };
  }

  /**
   * Picks and reads a file
   */
  async pickFile(options: FileValidationOptions = {}): Promise<FilePickResult | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: options.allowedTypes || '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Logger.debug('File picker cancelled by user');
        return null;
      }

      const asset = result.assets[0];

      // Validate file
      const validation = this.validateFile(asset, options);
      if (!validation.valid) {
        Alert.alert('Invalid File', validation.error!);
        Logger.warn('File validation failed', { error: validation.error });
        return null;
      }

      // Read file content
      const response = await fetch(asset.uri);
      const content = await response.text();

      Logger.info('File loaded successfully', {
        name: asset.name,
        size: asset.size,
      });

      return {
        content,
        name: asset.name,
        size: asset.size || 0,
        mimeType: asset.mimeType,
      };
    } catch (error) {
      Logger.error('File pick failed', error);
      Alert.alert('Error', ERROR_MESSAGES.FILE_LOAD_FAILED);
      return null;
    }
  }

  /**
   * Downloads/saves a file (platform-specific)
   */
  async downloadFile(
    content: string,
    filename: string,
    mimeType: string = 'text/plain'
  ): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return this.downloadFileWeb(content, filename, mimeType);
      } else {
        return this.shareFileMobile(content, filename);
      }
    } catch (error) {
      Logger.error('File download failed', error);
      Alert.alert('Error', ERROR_MESSAGES.FILE_SAVE_FAILED);
      return false;
    }
  }

  /**
   * Downloads file on web platform
   */
  private downloadFileWeb(content: string, filename: string, mimeType: string): boolean {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Logger.info('File downloaded successfully (web)', { filename });
      return true;
    } catch (error) {
      Logger.error('Web download failed', error);
      return false;
    }
  }

  /**
   * Shares file on mobile platforms
   */
  private async shareFileMobile(content: string, filename: string): Promise<boolean> {
    try {
      const result = await Share.share({
        message: content,
        title: filename,
      });

      if (result.action === Share.sharedAction) {
        Logger.info('File shared successfully (mobile)', { filename });
        return true;
      }

      return false;
    } catch (error) {
      Logger.error('Mobile share failed', error);
      return false;
    }
  }

  /**
   * Shares content (simpler API for plain text)
   */
  async shareContent(content: string, title?: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // On web, copy to clipboard as fallback
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(content);
          Alert.alert('Copied!', 'Content copied to clipboard');
          return true;
        }
        return false;
      } else {
        const result = await Share.share({
          message: content,
          title: title || 'Share Content',
        });

        return result.action === Share.sharedAction;
      }
    } catch (error) {
      Logger.error('Content share failed', error);
      Alert.alert('Error', 'Failed to share content');
      return false;
    }
  }
}

// Export singleton instance
export const FileService = new FileServiceClass();

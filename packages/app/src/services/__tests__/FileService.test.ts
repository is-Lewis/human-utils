/**
 * Tests for FileService
 *
 * @module __tests__/FileService.test
 */

import { FileService } from '../FileService';
import { LIMITS } from '../../constants/limits';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
  Alert: {
    alert: jest.fn(),
  },
  Share: {
    share: jest.fn(),
  },
}));

import * as DocumentPicker from 'expo-document-picker';

// Mock fetch
global.fetch = jest.fn();

describe('FileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pickFile', () => {
    it('should successfully pick and read a file', async () => {
      const mockContent = 'test file content';

      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: 'file://test.txt',
            name: 'test.txt',
            size: 100,
            mimeType: 'text/plain',
          },
        ],
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockContent),
      });

      const result = await FileService.pickFile({ allowedTypes: ['text/plain'] });

      expect(result).not.toBeNull();
      expect(result?.content).toBe(mockContent);
      expect(result?.name).toBe('test.txt');
    });

    it('should return null when user cancels', async () => {
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: true,
      });

      const result = await FileService.pickFile();

      expect(result).toBeNull();
    });

    it('should reject files exceeding size limit', async () => {
      const maxSize = LIMITS.FILE.MAX_SIZE_MB;
      const tooLargeSize = (maxSize + 1) * 1024 * 1024;

      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: 'file://large.txt',
            name: 'large.txt',
            size: tooLargeSize,
            mimeType: 'text/plain',
          },
        ],
      });

      const result = await FileService.pickFile({ maxSizeMB: maxSize });

      expect(result).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid File',
        expect.stringContaining(`${maxSize}MB`)
      );
    });

    it('should validate MIME types', async () => {
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: 'file://test.pdf',
            name: 'test.pdf',
            size: 100,
            mimeType: 'application/pdf',
          },
        ],
      });

      const result = await FileService.pickFile({
        allowedTypes: ['text/plain', 'application/json'],
      });

      expect(result).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid File',
        expect.stringContaining('Invalid file type')
      );
    });

    it('should handle read errors', async () => {
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: 'file://test.txt',
            name: 'test.txt',
            size: 100,
            mimeType: 'text/plain',
          },
        ],
      });

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Read failed'));

      const result = await FileService.pickFile();

      expect(result).toBeNull();
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load file');
    });
  });

  describe('downloadFile', () => {
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;
    let clickSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock DOM methods for web
      global.Blob = jest.fn().mockImplementation((content, options) => ({
        content,
        options,
      })) as any;

      global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();

      clickSpy = jest.fn();
      const mockAnchor = {
        href: '',
        download: '',
        click: clickSpy,
        style: {},
      };

      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      appendChildSpy = jest
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockAnchor as any);
      removeChildSpy = jest
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockAnchor as any);
    });

    afterEach(() => {
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should create download link with correct attributes', async () => {
      await FileService.downloadFile('test content', 'test.txt', 'text/plain');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(global.Blob).toHaveBeenCalledWith(['test content'], { type: 'text/plain' });
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should use default MIME type if not provided', async () => {
      await FileService.downloadFile('content', 'file.txt');

      expect(global.Blob).toHaveBeenCalledWith(['content'], { type: 'text/plain' });
    });

    it('should handle JSON MIME type', async () => {
      await FileService.downloadFile('{"key":"value"}', 'data.json', 'application/json');

      expect(global.Blob).toHaveBeenCalledWith(['{"key":"value"}'], { type: 'application/json' });
    });
  });
});

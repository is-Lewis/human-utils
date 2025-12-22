/**
 * Tests for Logger service
 *
 * @module __tests__/Logger.test
 */

import { Logger } from '../Logger';

// Mock console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

describe('Logger Service', () => {
  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      Logger.debug('Test debug message');
      expect(console.log).toHaveBeenCalledWith('[DEBUG] Test debug message', '');
    });

    it('should log with metadata', () => {
      const metadata = { key: 'value' };
      Logger.debug('Test', metadata);
      expect(console.log).toHaveBeenCalledWith('[DEBUG] Test', metadata);
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      Logger.info('Test info message');
      expect(console.log).toHaveBeenCalledWith('[INFO] Test info message', '');
    });
  });

  describe('warn', () => {
    it('should log warnings', () => {
      Logger.warn('Test warning');
      expect(console.warn).toHaveBeenCalledWith('[WARN] Test warning', '');
    });

    it('should log warnings with metadata', () => {
      const metadata = { error: 'details' };
      Logger.warn('Warning', metadata);
      expect(console.warn).toHaveBeenCalledWith('[WARN] Warning', metadata);
    });
  });

  describe('error', () => {
    it('should log errors with message', () => {
      const error = new Error('Test error');
      Logger.error('Error occurred', error);
      expect(console.error).toHaveBeenCalled();
      const call = (console.error as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('[ERROR] Error occurred');
      expect(call[1]).toMatchObject({
        message: 'Test error',
        name: 'Error',
      });
    });

    it('should log errors with metadata', () => {
      const error = new Error('Test error');
      const metadata = { context: 'test' };
      Logger.error('Error with context', error, metadata);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      Logger.error('Something failed', { code: 500 });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('logUserAction', () => {
    it('should log user actions', () => {
      Logger.logUserAction('button_click');
      expect(console.log).toHaveBeenCalledWith('[USER ACTION] button_click', '');
    });

    it('should log user actions with properties', () => {
      const properties = { buttonId: 'submit', page: 'home' };
      Logger.logUserAction('button_click', properties);
      expect(console.log).toHaveBeenCalledWith('[USER ACTION] button_click', properties);
    });
  });

  describe('performance', () => {
    it('should log performance metrics', () => {
      Logger.performance('operation', 123.45);
      expect(console.log).toHaveBeenCalledWith('[PERF] operation: 123.45ms', '');
    });

    it('should handle zero duration', () => {
      Logger.performance('instant_operation', 0);
      expect(console.log).toHaveBeenCalledWith('[PERF] instant_operation: 0.00ms', '');
    });

    it('should format duration to 2 decimal places', () => {
      Logger.performance('operation', 123.456789);
      expect(console.log).toHaveBeenCalledWith('[PERF] operation: 123.46ms', '');
    });
  });

  describe('startTimer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a function that logs elapsed time', () => {
      const endTimer = Logger.startTimer('test_operation');

      jest.advanceTimersByTime(100);

      endTimer();

      // Should have called performance logging
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as jest.Mock).mock.calls[0];
      expect(call[0]).toMatch(/\[PERF\] test_operation: \d+\.\d+ms/);
    });

    it('should handle multiple concurrent timers', () => {
      const timer1 = Logger.startTimer('operation1');
      const timer2 = Logger.startTimer('operation2');

      jest.advanceTimersByTime(50);
      timer1();

      jest.advanceTimersByTime(50);
      timer2();

      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('singleton pattern', () => {
    it('should maintain singleton instance', () => {
      const instance1 = Logger;
      const instance2 = Logger;
      expect(instance1).toBe(instance2);
    });
  });
});

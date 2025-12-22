// Jest setup file
// Runs before each test suite

// Mock global __DEV__
global.__DEV__ = true;

// Mock performance.now() for timers
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
  };
}

// Suppress console errors in tests (optional)
// global.console.error = jest.fn();

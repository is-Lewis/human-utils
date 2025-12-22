/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'packages/cli/src/utils/**/*.ts',
    'packages/app/src/services/**/*.ts',
    'packages/app/src/hooks/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageThreshold: {
    // Per-file thresholds for critical modules
    './packages/cli/src/utils/crypto.ts': {
      branches: 25,
      functions: 80,
      lines: 20,
      statements: 21,
    },
    './packages/app/src/services/Logger.ts': {
      branches: 75,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './packages/app/src/services/FileService.ts': {
      branches: 66,
      functions: 66,
      lines: 63,
      statements: 63,
    },
  },
  moduleNameMapper: {
    '^@human-utils/cli$': '<rootDir>/packages/cli/src/index.ts',
  },
  globals: {
    __DEV__: true,
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2020',
        lib: ['ES2020', 'DOM'],
      },
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

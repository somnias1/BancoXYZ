/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/config$': '<rootDir>/src/__mocks__/config.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(tsx?|js)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@faker-js/faker)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};

module.exports = config;

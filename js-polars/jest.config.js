/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: "tsconfig.test.json",
    },
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '@polars/index': '<rootDir>/pkg_test/js_polars.js',
    '@polars': '<rootDir>/pkg_test/js_polars.js',
    'chance': '<rootDir>/node_modules/chance',
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/setup.ts"]
};
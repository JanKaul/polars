/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: "tsconfig.test.json",
    },
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '@polars/index': '<rootDir>/pkg/js_polars',
    '@polars': '<rootDir>/pkg/js_polars',
    'chance': '<rootDir>/node_modules/chance',
  },
  // setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/setup.ts"]
};
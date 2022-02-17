/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: "tsconfig.json",
    },
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '@polars/index': '<rootDir>/pkg/polars',
    '@polars': '<rootDir>/pkg/polars',
  },
};
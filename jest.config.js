/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      useESM: true,
      // tsconfig: 'tsconfig.spec.json',
    }
  },
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  extensionsToTreatAsEsm: [ ".ts" ]
};
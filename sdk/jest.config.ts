import type { Config } from 'jest';

const config: Config = {
  // or 'ts-jest' alone is fine too
  preset: 'ts-jest/presets/default',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: [ '**/*.test.ts' ],
  moduleFileExtensions: [ 'ts', 'js', 'json' ],
  transform: {
    '^.+\\.ts$': [ 'ts-jest', {
      tsconfig: 'tsconfig.spec.json'
    } ]
  }
};

export default config;

module.exports = {
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.mock.ts'],
  testRunner: 'jest',
  jest: {
    enableFindRelatedTests: false, // needed because of the windows bug
    configFile: './jest.config.mutation.js',
  },
  concurrency: 4,
  coverageAnalysis: 'perTest',
  reporters: ['progress', 'clear-text', 'html'],
  htmlReporter: {
    baseDir: './reports/mutation',
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
};

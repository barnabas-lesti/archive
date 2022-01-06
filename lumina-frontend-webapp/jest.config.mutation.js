// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require('./jest.config.base')({
  testType: 'mutation',
  // setupFilesAfterEnv: ['./jest.setup.ts'],
  reports: false,
  collectCoverage: false,
});

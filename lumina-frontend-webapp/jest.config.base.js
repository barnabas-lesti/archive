const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = ({
  testMatch = ['**/+(*.)+(spec).+(ts)'],
  testType = '',
  reports = true,
  collectCoverage = true,
  coverageThreshold = {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  setupFilesAfterEnv = ['./jest.setup.ts'],
}) => ({
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),

  setupFilesAfterEnv,
  testMatch,

  collectCoverage,
  coverageThreshold,
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.mock.ts',
  ],
  coverageDirectory: `./reports/${testType}/coverage`,

  reporters: reports
    ? [
        'default',
        [
          'jest-html-reporters',
          {
            publicPath: `./reports/${testType}`,
            filename: 'report.html',
          },
        ],
      ]
    : [],
});

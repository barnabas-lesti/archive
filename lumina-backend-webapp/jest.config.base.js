module.exports = ({
  testRegex = ['.*\\.spec\\.ts$'],
  testType = '',
  reports = true,
  collectCoverage = true,
  coverageThreshold = {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  setupFilesAfterEnv = ['../jest.setup.ts'],
}) => ({
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testPathIgnorePatterns: ['/node_modules', '/dist'],
  setupFilesAfterEnv,
  testRegex,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverage,
  coverageThreshold,
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.mock.ts',
  ],
  coverageDirectory: `../reports/${testType}/coverage`,

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

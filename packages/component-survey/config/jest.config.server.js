module.exports = {
  displayName: 'component-survey-server',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/server/**/*.test.js',
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

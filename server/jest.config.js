module.exports = {
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/server/jest-setup.js',
  testMatch: ['<rootDir>/server/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

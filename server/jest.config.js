module.exports = {
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/server/jest-setup.js',
  testMatch: ['<rootDir>/server/**/*.test.js'],
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

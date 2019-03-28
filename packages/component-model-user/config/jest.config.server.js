module.exports = {
  displayName: 'component-model-user',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/config/jest-setup.server.js',
  testMatch: ['<rootDir>/**/*.test.js'],
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

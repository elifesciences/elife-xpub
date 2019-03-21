module.exports = {
  displayName: 'package-server',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/packages/jest-setup.server.js',
  testMatch: ['<rootDir>/packages/**/server/**/*.test.js'],
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

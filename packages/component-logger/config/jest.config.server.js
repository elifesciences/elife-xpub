module.exports = {
  displayName: 'component-logger',
  rootDir: '../',
  testMatch: ['<rootDir>/server/**/*.test.js'],
  transform: {}, // turn off babel for server code
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  testEnvironment: 'node',
}

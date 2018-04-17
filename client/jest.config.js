module.exports = {
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/test/helpers/jest-setup.js',
  testMatch: ['<rootDir>/client/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
}

module.exports = {
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/test/helpers/jest-setup.js',
  testMatch: ['<rootDir>/app/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
  },
}

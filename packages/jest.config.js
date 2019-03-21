module.exports = {
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/packages/jest-setup.js',
  testMatch: ['<rootDir>/packages/**/**.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet|xpub)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    '^ui(.*)$': '<rootDir>/app/components/ui$1',
    '^global(.*)$': '<rootDir>/app/components/global$1',
  },
}

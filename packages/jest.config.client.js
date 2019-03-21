module.exports = {
  displayName: 'package-client',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/packages/jest-setup.client.js',
  testMatch: ['<rootDir>/packages/**/client/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet|xpub)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    '^ui(.*)$': '<rootDir>/app/components/ui$1',
    '^global(.*)$': '<rootDir>/app/components/global$1',
  },
}

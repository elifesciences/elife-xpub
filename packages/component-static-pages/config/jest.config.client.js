module.exports = {
  displayName: 'component-static-pages-client',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/config/jest-setup.client.js',
  testMatch: ['<rootDir>/client/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet|xpub)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    '^ui(.*)$': '<rootDir>/../../app/components/ui$1',
    '^global(.*)$': '<rootDir>/../../app/components/global$1',
  },
}

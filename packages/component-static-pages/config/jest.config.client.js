module.exports = {
  displayName: 'component-static-pages-client',
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/config/jest-setup.client.js'],
  testMatch: ['<rootDir>/client/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet|xpub)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
  },
}

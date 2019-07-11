module.exports = {
  displayName: 'component-elife-app',
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/config/jest-setup.client.js'],
  testMatch: ['<rootDir>/client/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/(?!@?pubsweet|xpub)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
  },
}

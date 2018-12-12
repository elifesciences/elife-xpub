const { File } = require('@elifesciences/xpub-model')

class DummyFile extends File {
  get storage() {
    return {
      putContent: () => {},
      getContent: () => {},
      deleteObject: () => ({
        promise: () => Promise.resolve(true),
      }),
    }
  }
}

module.exports = DummyFile

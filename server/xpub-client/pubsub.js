class PubsubClient {
  constructor(PubsubManager) {
    this.manager = PubsubManager
    this.pubsub = null
    this.publishingInterval = null
  }

  async initialize() {
    this.pubsub = await this.manager.getPubsub()
  }

  publish(message, dataCallback) {
    this.pubsub.publish(message, dataCallback())
  }

  startPublishingOnInterval(message, dataCallback, interval) {
    this.publishingInterval = setInterval(
      () => this.publish(message, dataCallback),
      interval,
    )
  }

  stopPublishingOnInterval(message, dataCallback) {
    clearInterval(this.publishingInterval)
    this.publishingInterval = null

    if (message && dataCallback) {
      this.publish(message, dataCallback)
    }
  }
}

module.exports = PubsubClient

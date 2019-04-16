class PubsubClient {
  constructor(PubsubManager) {
    this.manager = PubsubManager
    this.pubsub = null
    this.publishingInterval = null
  }

  async initialize() {
    this.pubsub = await this.manager.getPubsub()
  }

  publish(message, data) {
    this.pubsub.publish(message, data)
  }

  startPublishingOnInterval(message, dataCallback, interval) {
    this.publishingInterval = setInterval(
      () => this.publish(message, dataCallback()),
      interval,
    )
  }

  stopPublishingOnInterval(message, data) {
    clearInterval(this.publishingInterval)
    this.publishingInterval = null

    if (message && data) {
      this.publish(message, data)
    }
  }
}

module.exports = PubsubClient

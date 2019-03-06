jest.useFakeTimers()
const PubsubClient = require('.')

const createPubsubManager = mockGet => ({ getPubsub: mockGet })
const createPubsub = (mockGetPubsub, mockPubsub = {}) => {
  const mockPubsubManager = createPubsubManager(
    mockGetPubsub || (() => mockPubsub),
  )
  return new PubsubClient(mockPubsubManager)
}

describe('PubsubClient', () => {
  describe('initialize', () => {
    it('calls getPubsub on the pubsub manager and stores it as an internal value', async () => {
      const mockPubsub = {}
      const mockGetPubsub = jest.fn(() => mockPubsub)
      const pubsub = createPubsub(mockGetPubsub)
      await pubsub.initialize()

      expect(mockGetPubsub).toBeCalled()
      expect(pubsub.pubsub).toBe(mockPubsub)
    })
  })
  describe('startPublishingOnInterval', () => {
    it('calls setInterval with the interval time passed', async () => {
      const mockPubsub = { publish: jest.fn() }
      const intervalTime = 1000
      const pubsub = createPubsub(null, mockPubsub)
      await pubsub.initialize()

      pubsub.startPublishingOnInterval('', () => {}, intervalTime)

      expect(setInterval).toHaveBeenCalled()
      expect(setInterval).toHaveBeenLastCalledWith(
        expect.any(Function),
        intervalTime,
      )
    })

    it('stores the interval as an object property', async () => {
      const mockPubsub = { publish: jest.fn() }
      const pubsub = createPubsub(null, mockPubsub)
      await pubsub.initialize()

      expect(pubsub.publishingInterval).toBeNull()
      pubsub.startPublishingOnInterval('', () => {}, 1)
      expect(pubsub.publishingInterval).not.toBeNull()
    })

    it('calls pubsub.publish and uses the callback to get the message value', async () => {
      const UPLOAD_MESSAGE = 'UPLOAD_MESSAGE'
      const mockMessage = { foo: 'bar' }
      const mockPublish = jest.fn()

      const mockPubsub = { publish: mockPublish }
      const pubsub = createPubsub(null, mockPubsub)
      await pubsub.initialize()

      pubsub.startPublishingOnInterval(UPLOAD_MESSAGE, () => mockMessage, 1000)
      expect(mockPublish).toHaveBeenCalledTimes(0)

      jest.advanceTimersByTime(1000)

      expect(mockPublish).toHaveBeenCalledTimes(1)
      expect(mockPublish).toBeCalledWith(UPLOAD_MESSAGE, mockMessage)
    })
  })

  describe('stopPublishingOnInterval', () => {
    it('clears interval when called', async () => {
      const mockPublish = jest.fn()
      const mockPubsub = { publish: mockPublish }
      const pubsub = createPubsub(null, mockPubsub)
      await pubsub.initialize()

      pubsub.startPublishingOnInterval('', () => {}, 1000)
      jest.advanceTimersByTime(1000)

      expect(mockPublish).toHaveBeenCalledTimes(1)
      expect(pubsub.publishingInterval).not.toBeNull()

      pubsub.stopPublishingOnInterval()

      expect(clearInterval).toBeCalled()
      expect(pubsub.publishingInterval).toBeNull()

      jest.advanceTimersByTime(1000)

      expect(mockPublish).toHaveBeenCalledTimes(1)
    })

    it('publishes a final message if a message and dataCallback are passed', async () => {
      const mockPublish = jest.fn()
      const mockPubsub = { publish: mockPublish }
      const pubsub = createPubsub(null, mockPubsub)
      await pubsub.initialize()

      const startIntervalAndStopWithArguments = (message, data) => {
        pubsub.startPublishingOnInterval('', () => {}, 1000)
        expect(mockPublish).toHaveBeenCalledTimes(0)
        pubsub.stopPublishingOnInterval(message, data)
      }

      startIntervalAndStopWithArguments()
      expect(mockPublish).toHaveBeenCalledTimes(0)

      startIntervalAndStopWithArguments('foo')
      expect(mockPublish).toHaveBeenCalledTimes(0)

      // Must be passed both params
      startIntervalAndStopWithArguments('foo', () => {})
      expect(mockPublish).toHaveBeenCalledTimes(1)
    })
  })
})

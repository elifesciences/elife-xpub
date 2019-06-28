const emailFilter = require('./emailFilter')

describe('Email Filter', () => {
  it('should not alter addresses without emails in them', () => {
    const message = 'hello this is a test'
    const newMessage = emailFilter('', message)
    expect(newMessage).toBe(message)
  })

  it('should replace an email address with ***@***.***', () => {
    const message = 'bob@bobsemail.com'
    const newMessage = emailFilter('', message)
    expect(newMessage).toBe('***@***.***')
  })

  it('should handle plus addressing', () => {
    const message = 'stuff+bob@bobsemail.com'
    const newMessage = emailFilter('', message)
    expect(newMessage).toBe('***@***.***')
  })

  it('should replace multiple addresses with ***@***.***', () => {
    const message =
      'hello this is bob from bob@bobsemail.com emailing frank@franksemail.com for a chat'
    const expectedMessage =
      'hello this is bob from ***@***.*** emailing ***@***.*** for a chat'
    const newMessage = emailFilter('', message)
    expect(newMessage).toBe(expectedMessage)
  })

  it('should handle linebreaks between email addresses', () => {
    const message =
      'hello this is bob from bob@bobsemail.com\r emailing frank@franksemail.com for a chat'
    const expectedMessage =
      'hello this is bob from ***@***.***\r emailing ***@***.*** for a chat'
    const newMessage = emailFilter('', message)
    expect(newMessage).toBe(expectedMessage)
  })
})

const { obfuscateEmail } = require('./obfuscate')

describe('obfuscation tests', () => {
  it('email obfuscate is correct', async () => {
    const emailString =
      'A<email>person1@email.com</email>B<email>person_2@email.com</email>C'
    const obfuscatedEmailString =
      'A<email>8326da0bae88ac7769619f71859358a8</email>B<email>ea42e94b38e7f1ffd6c3cc20ffd21373</email>C'
    expect(obfuscateEmail(emailString)).toBe(obfuscatedEmailString)
  })
})

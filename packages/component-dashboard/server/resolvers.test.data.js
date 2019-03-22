exports.userData = {
  identities: [
    {
      type: 'elife',
      identifier: 'ewwboc7m',
      email: 'test@example.com',
      meta: {
        orcid: '0000-0003-3146-0256',
      },
    },
  ],
}

exports.badUserData = {
  identities: [
    {
      type: 'elife',
      identifier: 'badbadnotgood',
      email: 'bad@example.com',
      meta: {
        orcid: '0000-0001-0000-0000',
      },
    },
  ],
}

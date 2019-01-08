const f = fixture('Submission')

f
  .before(() => Promise.resolve())
  .beforeEach(() => Promise.resolve())
  .afterEach(() => Promise.resolve())

test('Happy path', async t => {
  await Promise.resolve()
})

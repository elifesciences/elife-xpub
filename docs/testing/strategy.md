# Testing Strategy

## Unit tests

Unit tests should be written for all new pieces of code going into the code base. If old code is being altered then the tests need to be altered to match where apropriate and if necessary new tests written to cover the new cases.

### Test Cases

Test cases need to be generated for each function / component being tested. These should include tests cases for Normal, Extreme and Error conditions and if necessary Edge cases need to be covered as well. Consider the following function:

```js
const someFunc = (op, ...numbers) => {
  let answer
  switch (expr) {
    case 'sum':
      return numbers.reduce((a, b) => a + b, 0)
    case 'avg':
      return numbers.reduce((a, b) => a + b, 0) / numbers.length
    case 'min':
      return Math.min(...numbers)
    case 'max':
      return Math.max(...numbers)
    default:
      console.log('op not recognised')
      return NaN
  }
}
```

This could be tested with a single test for each `op` parameter, this would suffice for code coverage but would not cover all of the applicable test cases. What happens if it was called with the following calls:

```js
   someFunc('avg', {numbers: [1,2,3]})  // Error caser
   someFunc('tree', 1, 2, 3, 4) // Error case
   someFunc('sum', [1, 2, 3, 4]) // Normal case
   someFunc(false, 1, 2, 3, 4) // Error case
   someFunc('max', 1, 2, 3, 4...) // 1 million int arguments, Extreme case
```

All five calls above would not be needed to test the function to a reasonable standard. We do not want to check every possible input as that would take far too long to both code and execute. Test cases can overlap and multiple cases can be executed from a single test. This can be written like so:

```js
describe('someFunc Tests', () => {
  //Error
  it('should handle incorrect op parameter', () => {
    expect(someFunc('false', 1, 2, 3)).toBe(NaN)
    expect(someFunc(false)).toThrow()
  })

  //Error
  it('should handle incorrect numbers parameter', () => {
    expect(someFunc('avg', [1, 2, 3])).toThrow()
    expect(someFunc('avg')).toBe(NaN)
  })

  //Extreme
  it('should be able to handle large amounts of input', () => {
    expect(someFunc('sum' /* lots of numbers */)).toBe(/*correct result */)
  })

  //Normal
  it('should return the average of a series of numbers passed in', () => {
    expect(someFunc('avg', 1, 2, 3)).toBe(2)
  }) // similar tests for normal cases for each op
})
```

> **Note** The test cases type commented above each test

### Mocking

When we unit test a file / function / component everything not part of it should be mocked out. This is to prevent failures in other parts of the code mudying up our tests. For Exmple:

```js
import fileService from './fileService'

const fileTitleNormaliser = fileId => {
  const file = fileService.getFile(fileId)
  file.title = file.title.toLowerCase()
  return fileService.updateFile(file) // returns boolean true or false for success / failure
}
```

In the above code the fileService may be third party so out of scope for our unit tests or it may ust be in another part of the repo, either way its a point of failure that we are not concerned with in this test so it needs to be mocked out:

```js
import fileService from './fileService'
const getFileMock =  jest.fn().mockImplemnentation(() => ({title: 'aBcDeF'}))
const updateFileMock =  jest.fn().mockImplemnentation(() => (true))
jest.mock('./fileService', () => {
 return jest.fn().mockImplementation(() => {
   return {getFile: getFileMock, updateFile: updateFileMock}
 }););

describe('fileUtils', () =>{
   beforeEach(() => {
       getFileMock.mockClear()
       updateFileMock.mockClear()
   })

   it('should make titles lower case', () => {
       expect(fileTitleNormaliser('someId')).toBe('abcdef')
       expect(getFileMock).toHaveBeenCalledTimes(1)
       expect(updateFileMock).toHaveBeenCalledTimes(1)
       expect(updateFileMock).toHaveBeenCalledWith({title: 'abcdef'})
   })
})
```

We can utilise the jest mocking for these as demonstrated above and this allows us to spy on the functions to ensure that they have been called the correct number of times and with the correct arguments. The mocks should be reset between tests to avoid cross test contamination.
For react components it is not necessary to mock out child components that are for display only, if they are executing logic that can affect the tests then they should be replaced with mocked components.

### File Structure

Unit tests should be placed alongisde the file they are testing with the .test appended to the filename before the extension. These will be automatically picked up by jest and run in the CI as well as localy. This is for clarity of what has been tested and just makes it easier to locate the apropriate tests when working on a file.

## Integration Tests

The integration tests are to test across a loayer of the code base. In the case of Linero Reviewer we are only testing across the server as clinet will be handled with our acceptance tests. It is important that these are easy to run from both the developer machines and the CI and these should be run before any code is puched to the remote branch.

### API Tests

The purpose of API testing is to check that the server responds in a sensible way for a given input. API tests typically submit data to the server through a GraphQL mutation, and then check that the data was properly persisted by querying it again in a way similar to how to the client would request the data, and asserting on the response. This allows the team to recreate situations in the server-side that are difficult to reliably test with browser tests. It also checks that the API remains stable between client and server.

#### Running it

```bash
# You need the platform running
# pwd = elife-xpub/
yarn start:services
# You may need to setup the db
yarn run pubsweet setupdb --clobber

# Start the server
yarn run pubsweet server

# Go to the api tests
cd tools/api-tests
# pwd = elife-xpub/tools/api-tests

# You should just be able to do this:
docker-compose build
docker-compose up
```

### What to test?

When writing integration tests we want to be testing the api endpoints for the server. These should use the new Api-test framework being put in place. We want to test the that the endpoint is acting in an expected and idempotent way. For example, calling `updateManuscript` via the graphql resolver should return an expected and correct result given sensible input and it should return the same result every time.

## Acceptance Tests

The acceptance tests are a suite of end-to-end test that focus only on the Libero Reviewer application.

### What to test?

For the acceptance tests we want to run them accross the entire collection of user stories. For example:

- "As a user I may want to change the file I uploaded when creating a submission"
- "As a user I want to be able to exclude a reiewer who I do not trust to be objective"
- "As a user I want to be able to upload my cover letter as a pdf / word document"
  These are just some samples but we can use the flow charts the UX team created to ensure that all paths are converted into user stories and tests.

### Running the Tests

Acceptance test take time to run, ideally the tests should be able to run in parallel which will require the tests to be written independant of what is currently in the database and should be able to run against on the dev boxes and in the CI without any additional effort on either side. The tests are currently planned to be done with testcafe so we can quickly convert our existing browser tests into new acceptance tests, however testcafe has restricitons on running in parallel accross multiple browsers which selenium can do out of the box (DISCUSSION NEEDED). The tests should have a quick and long run tag so we can have a set of tests that run on push to a PR that wont take hours and a set of full tests that run nightly and/or on production builds. The tests should also be able to run localy and ideally run in parallel, this will necesitate some re-writing of our existing browser tests before they are converted to acceptance tests.

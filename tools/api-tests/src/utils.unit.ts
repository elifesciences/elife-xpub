import { test, TestContext } from 'ava-ts';

import { stripTypeNameFromJson } from './utils';

test("__typename is stripped from nested objects", (t: TestContext) => {
  const input = {
    __typename: 'aTestType',
    some: 'other',
    data: 'should',
    stay: 'the',
    same: {
      __typename: 'AnotherTestType',
      and: 'this',
      should: 'too',
      deeper: {
        __typename: 'YetAnotherTypeName',
        key: 'value',
      },
      not_deeper_but_more: {
        __typename: 'YetAnotherTypeName',
        key: 'value',
      }

    }
  };

  const expected_output = {
    some: 'other',
    data: 'should',
    stay: 'the',
    same: {
      and: 'this',
      should: 'too',
      deeper: {
        key: 'value',
      },
      not_deeper_but_more: {
        key: 'value',
      }

    }
  };


  t.deepEqual(stripTypeNameFromJson(input), expected_output);
});

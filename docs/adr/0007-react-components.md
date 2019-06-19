# 0007 React Components

Date: 12th June 2019

## Status

Proposed

## Context

There needs to be some general principles on best practise in creating react
components for the project. This should lead to more readable and testable
code which should always be the aim.

### Separation of View and Logic

- In general small easily understood logic or logic that is very specific
  should like near the code where it is used. Extracting such code would be
  an overhead and decrease readability.
- More generally logic should be extracted particularly where it is complex or
  re-useable. This will make it more easily testable and the calling code more
  readable.
- Please contribute more

### Use of React Hooks

- Please contribute more

### Testing Principles

- Stand alone logic should be tested with the current famework (currently jest)
- All react components in general should be tested using `testing-library/react`
- Please contribute more

Its recommended to write tests that assert each component's public interface, with
its internals treated as a black box. Each test case should provide the component with some input
like props or user interactions and assert on the expected output, be it render result or method calls
on provided props.

As example, lets take a simple Counter component which increments a counter by one by clicking on a button.

```
import React, { useState } from 'react'

const Counter = props => {
  const [localValue, setLocalValue] = useState(props.value || 0)

  return (
    <div>
      Counter is <span data-testid="counter">{localValue}</span>
      <button data-testid="increment" onClick={() => setLocalValue(localValue + 1)}>+1</button>
    </div>
  )
}

export default Counter
```

An obvious is testing that the counter displays the passed value in the props:

```
import { render, cleanup } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  it('should display passed value', () => {
    const { getByTestId } = render(<Counter value={10} />)

    expect(getByTestId('counter').textContent).toBe('10') })
    cleanup()
  })
})
```

The input in this case is the `value` prop which is set to 10. The output is the rendering, which we check
via the data-testid attribute.

Another part of the component's public interface are user events like mouse clicks or keyboard input. In
the example above, we could test that clicking the button gives the intended result.

```
import { render, fireEvent } from '@testing-library/react'
import Counter from './Counter'describe('Counter', () => {

describe('Counter', () => {
  it('should increment the counter by one on button click', () => {
    const { getByTestId } = render(<Counter value={5} />)

    fireEvent.click(getByTestId('increment'))
    expect(getByTestId('counter').textContent).toBe('6')
    cleanup()
  })
})
```

## Decision

## Consequences

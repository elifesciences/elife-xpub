# 0007 React Components

Date: 12th June 2019

## Status

Proposed

## Context

There needs to be some general principles on best practice in creating React
components for the project. This should lead to more readable and testable
code which should always be the aim.

### Separation of View and Logic

- In general, small easily understood logic or logic that is very specific
  should live near the code where it is used. Extracting such code would be
  an overhead and decrease readability.
- More generally, logic should be extracted, particularly where it is complex or
  re-useable. This will make it more easily testable and the calling code more
  readable.
- Please contribute more

### Use of React Hooks

Hooks should be used instead of class components / HOCs where apropriate.

Any component that needs state can be created as a functional component using the `useState` hook. see: [useState](https://reactjs.org/docs/hooks-state.html)

For example:

```javascript
import React, { useState } from 'react'

const someComponent = props => {
  const defaultValue = 'Whats that?'
  const [value, valueSetter] = useState(defaultValue)
  console.log(value) // Whats that?
  valueSetter('SQUIRREL!')
  console.log(value) // SQUIRREL!

  return <span>{value}</span>
}
```

Components that require logic to be run at various lifecycle stages can use the `useEffects` hook. see: [useEffect](https://reactjs.org/docs/hooks-effect.html)
Note: this requires a function to be returned which cleans up any subscriptions, similar to `componentWillUnmount()`

For example: `setTimeout()` should return `clearTimeout()`

```javascript
import React, { useEffect, useState } from 'react'
const someComponent = props => {
  const [secondsLeft, setSecondsLeft] = useState(10)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)
    return () => clearTimeout(timerId) // clean up method
  })

  return <span> You have {secondsLeft} to comply!</span>
}
```

Current hooks provided in `React 16.8.6`:

- useState
- useEffects
- useContext
- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue

For more information on these hooks see [hooks api reference](https://reactjs.org/docs/hooks-reference.html)

- Please contribute more

### Testing Principles

- Utility functions that have been extracted from the React component because they are not tightly coupled with how the component should work (ie: data modelling/processing or validation schemas) should be tested with the standard testing framework (currently jest)
- All React components in general should be tested using `testing-library/react`
- Testing should be carried out with a TDD approach of blackbox testing where possible rather than testing implementation detail (__focus on simulating user interactions and passing props not testing internal functions (like instance() testing in enzyme!)__, see [here](https://kentcdodds.com/blog/why-i-never-use-shallow-rendering) for explanation)
* A unit of functionality in React can involve multiple child components integrating with each other correctly. Don't feel the need to mock out child components in tests unless absolutely necessary (Better a test fail because it's child components are not working correctly in a use-case context then to miss catching errors because of 'unit testing purity')
- Please contribute more

It's recommended to write tests that assert each component's public interface, with
its internals treated as a black box. Each test case should provide the component with some input
like props or user interactions and assert on the expected output, be it render result or method calls
on provided props.

As an example, lets take a simple Counter component which increments a counter by one by clicking on a button.

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

#### Reading for context

- [Kent C. Dodds (author of `testing-library/react`)  - _Why I Never Use Shallow Rendering_](https://kentcdodds.com/blog/why-i-never-use-shallow-rendering)

- [_Testing Drag and Drop Components in React.js_](https://github.com/HurricaneJames/dex/blob/master/doc/Testing%20Complex%20Components%20in%20React.js.md)
## Decision

## Consequences

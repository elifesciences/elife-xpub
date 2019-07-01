import { memo } from 'react'
import { isEqual } from 'lodash'

// Apollo passes a data prop with some function properties as well as the query data and any errors that might
// have been thrown. React is diffing these and evaluating the functions as changed props which is
// triggering unwanted re-renders. Using isEqual within a React memo solves this.
export default Component =>
  memo(
    Component,
    (prevProps, currentProps) => !isEqual(prevProps, currentProps),
  )

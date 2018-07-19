import React from 'react'
import { Action } from '@pubsweet/ui'
import lodash from 'lodash'

const MoreButton = ({
  empty,
  fieldName,
  namedAs,
  objectName,
  setFieldValue,
  type = 'suggest',
  more = 'another',
  values,
}) => (
  <Action
    name={namedAs}
    onClick={() =>
      setFieldValue(
        fieldName,
        lodash.get(values, fieldName).concat(empty),
        false,
      )
    }
    type="button"
  >
    {type} {lodash.get(values, fieldName).length ? more : 'a'} {objectName}
  </Action>
)

export default MoreButton

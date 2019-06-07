import { useState, useEffect } from 'react'
import { omit, isEqual, cloneDeep } from 'lodash'
import { FORM_FIELDS_TO_OMIT } from '../utils/constants'

// reference to props being saved (see below)
let scopedProps

const SubmissionSave = props => {
  const [previousValues, setPreviousValues] = useState(cloneDeep(props.values))
  const [isSaving, setIsSaving] = useState(false)

  // updated scopedProps with new props
  // this is needed as when calling setInterval, the save method
  // from the first render would be called with the initial props object
  scopedProps = props

  useEffect(() => {
    const timer = setInterval(save, 10000)
    return () => clearInterval(timer)
  }, [])

  function save() {
    const filteredPreviousValues = omit(previousValues, FORM_FIELDS_TO_OMIT)
    const filteredCurrentValues = omit(scopedProps.values, FORM_FIELDS_TO_OMIT)

    if (!isSaving && !isEqual(filteredPreviousValues, filteredCurrentValues)) {
      setPreviousValues(scopedProps.values)
      setIsSaving(true)

      props
        .onUpdate(filteredCurrentValues)
        .then(() => setIsSaving(false))
        .catch(() => setIsSaving(false))
    }
  }

  return null
}

export default SubmissionSave

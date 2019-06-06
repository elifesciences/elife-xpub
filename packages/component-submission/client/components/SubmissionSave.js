import { useState, useEffect } from 'react'
import { omit, isEqual, cloneDeep } from 'lodash'
import { FORM_FIELDS_TO_OMIT } from '../utils/constants'

const SubmissionSave = props => {
  const [previousValues, setPreviousValues] = useState(cloneDeep(props.values))
  const [isSaving, setIsSaving] = useState(false)
  let timer

  useEffect(() => {
    timer = setInterval(() => save, 5000)
    return () => clearInterval(timer)
  }, [])

  function save() {
    const filteredPreviousValues = omit(previousValues, FORM_FIELDS_TO_OMIT)
    const filteredCurrentValues = omit(props.values, FORM_FIELDS_TO_OMIT)

    if (!isSaving && !isEqual(filteredPreviousValues, filteredCurrentValues)) {
      setPreviousValues(props.values)
      setIsSaving(true)

      props
        .onUpdate(filteredCurrentValues)
        .then(() => setIsSaving(false))
        .then(() => setIsSaving(false))
    }
  }
}

export default SubmissionSave

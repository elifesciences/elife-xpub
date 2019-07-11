import React, { useState } from 'react'
import {
  FormH2,
  Paragraph,
} from '@elifesciences/component-elife-ui/client/atoms'
import { Button, TextField } from '@pubsweet/ui'

const SurveyPage = () => {
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [timeAsPI, setTimeAsPI] = useState('')
  return (
    <React.Fragment>
      <FormH2>Help us reduce bias</FormH2>
      <Paragraph.Writing>
        Answering the following questions about the last author of your
        submission (i.e. group leader or principal investigator) will help our
        efforets to reduce bias in our submission and peer review process.
      </Paragraph.Writing>
      <Paragraph.Writing>
        Your answers will not be shared with the Editors handling the papaer and
        will be anonymised when we analyse the data we collect.
      </Paragraph.Writing>
      <TextField
        label="Country of residence of Last Author"
        onChange={e => setCountry(e.value)}
        value={country}
      />
      <TextField
        label="Gender of Last Author"
        onChange={e => setGender(e.value)}
        value={gender}
      />
      <TextField
        label="Country of residence of Last Author"
        onChange={e => setTimeAsPI(e.value)}
        value={timeAsPI}
      />
      <Button data-test-id="submit" onClick="Done" primary type="button">
        Done
      </Button>
    </React.Fragment>
  )
}

export default SurveyPage

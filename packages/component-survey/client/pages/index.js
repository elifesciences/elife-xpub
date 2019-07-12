import React, { useState } from 'react'
import {
  FormH2,
  Paragraph,
} from '@elifesciences/component-elife-ui/client/atoms'
import { Button, TextField } from '@pubsweet/ui'
import { Box } from '@rebass/grid'

const SurveyPage = () => {
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [timeAsPI, setTimeAsPI] = useState('')
  return (
    <Box mx="25%" width={1 / 2}>
      <FormH2>Help us reduce bias</FormH2>
      <Paragraph.Writing>
        Answering the following questions about the last author of your
        submission (i.e. group leader or principal investigator) will help our
        efforets to reduce bias in our submission and peer review process.
      </Paragraph.Writing>
      <Paragraph.Writing>
        Your answers will <u>not</u> be shared with the Editors handling the
        papaer and will be anonymised when we analyse the data we collect.
      </Paragraph.Writing>
      <Box mb={3}>
        <TextField
          label="Country of residence of Last Author:"
          onChange={e => setCountry(e.target.value)}
          placeholder="Enter text here"
          value={country}
        />
      </Box>
      <Box mb={3}>
        <TextField
          label="Gender of Last Author:"
          onChange={e => setGender(e.target.value)}
          placeholder="Enter text here"
          value={gender}
        />
      </Box>
      <Box mb={4}>
        <TextField
          label="When did the Last Author become an independent researcher?"
          onChange={e => setTimeAsPI(e.target.value)}
          placeholder="Enter text here"
          value={timeAsPI}
        />
      </Box>
      <Button data-test-id="submit" primary type="button">
        {country === '' && gender === '' && timeAsPI === '' ? 'Skip' : 'Done'}
      </Button>
    </Box>
  )
}

export default SurveyPage

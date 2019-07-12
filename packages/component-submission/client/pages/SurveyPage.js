import React, { useState } from 'react'
import { compose } from 'recompose'

import {
  FormH2,
  Paragraph,
} from '@elifesciences/component-elife-ui/client/atoms'
import { Button, TextField } from '@pubsweet/ui'
import { Box } from '@rebass/grid'
import surveyWithGQL from '../graphql/surveyWithGQL'

const SurveyPage = ({ submitSurveyResponse, match, history }) => {
  const [question1, setQuestion1] = useState('')
  const [question2, setQuestion2] = useState('')
  const [question3, setQuestion3] = useState('')

  const questions = {
    question1: 'Country of residence of Last Author:',
    question2: 'Gender of Last Author:',
    question3: 'When did the Last Author become an independent researcher?',
  }

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
          label={questions.question1}
          onChange={e => setQuestion1(e.target.value)}
          placeholder="Enter text here"
          value={question1}
        />
      </Box>
      <Box mb={3}>
        <TextField
          label={questions.question2}
          onChange={e => setQuestion2(e.target.value)}
          placeholder="Enter text here"
          value={question2}
        />
      </Box>
      <Box mb={4}>
        <TextField
          label={questions.question3}
          onChange={e => setQuestion3(e.target.value)}
          placeholder="Enter text here"
          value={question3}
        />
      </Box>
      <Button
        data-test-id="submit"
        onClick={() =>
          submitSurveyResponse({
            variables: {
              data: {
                submissionId: match.params.id,
                surveyId: 'demographicSurvey',
                answers: [
                  {
                    questionId: 'question1',
                    text: questions.question1,
                    answer: question1,
                  },
                  {
                    questionId: 'question2',
                    text: questions.question2,
                    answer: question2,
                  },
                  {
                    questionId: 'question3',
                    text: questions.question3,
                    answer: question3,
                  },
                ],
              },
            },
          }).then(() => {
            history.push(`/thankyou/${match.params.id}`)
          })
        }
        primary
        type="button"
      >
        {question1 === '' && question2 === '' && question3 === ''
          ? 'Skip'
          : 'Done'}
      </Button>
    </Box>
  )
}

export default compose(surveyWithGQL)(SurveyPage)

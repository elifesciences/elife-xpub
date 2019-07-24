import React, { useState } from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'
import {
  FormH2,
  Paragraph,
  Bold,
} from '@elifesciences/component-elife-ui/client/atoms'
import { Button, TextField } from '@pubsweet/ui'
import { Box } from '@rebass/grid'
import surveyWithGQL from '../graphql/surveyWithGQL'

const FormH2WithMargin = styled(FormH2)`
  margin-top: 120px;
`

export const SurveyPage = ({ submitSurveyResponse, match, history }) => {
  const [question1, setQuestion1] = useState('')
  const [question2, setQuestion2] = useState('')
  const [question3, setQuestion3] = useState('')

  const questions = {
    question1: "The group leader's country of residence:",
    question2: "The group leader's gender:",
    question3:
      'The year in which the group leader became an independent researcher (e.g., head of their own lab):',
  }

  return (
    <Box mx="25%" width={1 / 2}>
      <FormH2WithMargin>Help us to investigate implicit bias</FormH2WithMargin>
      <Paragraph.Writing>
        Please help us to learn more about the demographic characteristics of
        submissions to eLife by providing information about the{' '}
        <Bold>group leader</Bold> who has{' '}
        <Bold>principal responsibility for the work</Bold> (e.g., the PI or
        project leader of the lab in which the majority of the work was
        conducted).
      </Paragraph.Writing>
      <Paragraph.Writing>
        Your answers will <u>not</u> be disclosed to the editors (or reviewers)
        of your submission, but aggregate data will inform the research we
        undertake into the submission and review process.
      </Paragraph.Writing>
      <Box mb={3}>
        <TextField
          data-test-id="survey-question-1"
          label={questions.question1}
          onChange={e => setQuestion1(e.target.value)}
          placeholder="Enter here"
          value={question1}
        />
      </Box>
      <Box mb={3}>
        <TextField
          data-test-id="survey-question-2"
          label={questions.question2}
          onChange={e => setQuestion2(e.target.value)}
          placeholder="Enter here"
          value={question2}
        />
      </Box>
      <Box mb={4}>
        <TextField
          data-test-id="survey-question-3"
          label={questions.question3}
          onChange={e => setQuestion3(e.target.value)}
          placeholder="Enter here"
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

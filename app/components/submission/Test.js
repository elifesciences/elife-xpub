import React from 'react'

import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'

export const GET_CURRENT_SUBMISSION = gql`
  query CurrentSubmission {
    currentSubmission {
      id
      title
      source
      submissionMeta {
        displayCorrespondent
        author {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

export const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($data: ManuscriptInput!) {
    updateSubmission(data: $data) {
      id
      title
      submissionMeta {
        author {
          firstName
          lastName
          email
          institution
        }
        displayCorrespondent
        correspondent {
          firstName
          lastName
          email
          institution
        }
      }
    }
  }
`

export const mutationData = {
  data: {
    id: 'a3dccb4f-9034-4a9e-aaa0-26f3ddf733d5',
    title: 'Super manuscript',
    source: 'Some source',
    submissionMeta: {
      coverLetter: 'this is some long text',
      author: {
        firstName: 'Thomas',
        lastName: 'Troglodyte',
        email: 'thomas@mail.com',
        institution: 'Sewer Inc.',
      },
      correspondent: {
        firstName: 'Gabi',
        lastName: 'Goblin',
        email: 'gabi@mail.com',
        institution: 'Wastelands',
      },
      stage: 'INITIAL',
    },
  },
}

const Test = () => (
  <ApolloConsumer>
    {client => {
      function runMutation() {
        client
          .query({ query: GET_CURRENT_SUBMISSION })
          // .mutate({mutation: UPDATE_SUBMISSION, variables: mutationData})
          .then(res => console.log(res.data))
      }
      return <button onClick={runMutation}>Run Mutation</button>
    }}
  </ApolloConsumer>
)

export default Test

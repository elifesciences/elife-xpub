import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_MANUSCRIPT } from '../SubmissionWizard/operations'
import Dashboard from './Dashboard'

const DashboardPage = ({ history }) => (
  <Mutation mutation={CREATE_MANUSCRIPT}>
    {createManuscript => (
      <Dashboard
        createManuscript={() =>
          createManuscript().then(result =>
            history.push(`/submit/${result.data.createManuscript.id}`),
          )
        }
      />
    )}
  </Mutation>
)

export default DashboardPage

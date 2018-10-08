import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Box } from 'grid-styled'
import { Button } from '@pubsweet/ui'

import { FormH2, FormH3 } from '../../ui/atoms/FormHeadings'
import Paragraph from '../../ui/atoms/Paragraph'

/* Temporary dashboard view pending receipt of designs */

const Header = styled.th`
  text-align: left;
  padding: 3px 6px;
`

const Cell = styled.td`
  border-top: 1px solid grey;
  padding: 3px 6px;
`

const Dashboard = ({ manuscripts, deleteManuscript, createSubmission }) => (
  <React.Fragment>
    <FormH2>Dashboard Dummy Page</FormH2>

    <Box mb={4}>
      <Button data-test-id="submit" onClick={createSubmission} primary>
        Submit a manuscript
      </Button>
    </Box>

    <FormH3>All manuscripts</FormH3>

    {!manuscripts.length && <p>No manuscripts to display</p>}

    {!!manuscripts.length && (
      <table data-test-id="manuscripts">
        <thead>
          <tr>
            <Header>Title</Header>
            <Header>Stage</Header>
            <Header />
          </tr>
        </thead>
        <tbody>
          {manuscripts.map(manuscript => (
            <tr key={manuscript.id}>
              <Cell data-test-id="title">
                <Paragraph data-test-id="title">
                  <Link to={`/submit/${manuscript.id}`}>
                    {manuscript.meta.title || '(Untitled)'}
                  </Link>
                </Paragraph>
              </Cell>
              <Cell data-test-id="stage">{manuscript.status}</Cell>
              <Cell>
                <Button onClick={() => deleteManuscript(manuscript.id)} small>
                  Delete
                </Button>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </React.Fragment>
)

export default Dashboard

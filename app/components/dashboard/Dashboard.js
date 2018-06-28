import React from 'react'
import { Link } from 'react-router-dom'
import { FormH2, FormH3 } from '../ui/atoms/FormHeadings'
import ButtonLink from '../ui/atoms/ButtonLink'

const Dashboard = ({ manuscripts }) => (
  <React.Fragment>
    <FormH2>Dashboard Dummy Page</FormH2>
    <ButtonLink data-test-id="submit" primary to="/submit">
      Submit a manuscript
    </ButtonLink>

    <FormH3>All manuscripts</FormH3>
    <ul>
      {manuscripts.map(manuscript => (
        <li key={manuscript.id}>
          <Link to={`/manuscript/${manuscript.id}`}>
            {manuscript.title || '(Untitled manuscript)'}
          </Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

export default Dashboard

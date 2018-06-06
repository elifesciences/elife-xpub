import React from 'react'
import { Link } from 'react-router-dom'
import ButtonLink from '../ui/atoms/ButtonLink'

const Dashboard = ({ manuscripts }) => (
  <React.Fragment>
    <h1>Dashboard Dummy Page</h1>
    <ButtonLink data-test-id="submit" primary to="/submit">
      Submit a manuscript
    </ButtonLink>

    <h3>All manuscripts</h3>
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

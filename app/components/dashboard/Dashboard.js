import React from 'react'
import { Link } from 'react-router-dom'
import ButtonLink from '../ui/atoms/ButtonLink'

const Dashboard = () => (
  <React.Fragment>
    <h1>Dashboard Dummy Page</h1>
    <ButtonLink data-test-id="submit" primary to="/submit">
      Submit a manuscript
    </ButtonLink>

    <h3>Sample manuscripts</h3>
    <ul>
      <li>
        <Link to="/manuscript/blank">Blank</Link>
      </li>
      <li>
        <Link to="/manuscript/elife-32671">eLife</Link>
      </li>
      <li>
        <Link to="/manuscript/kitchen-sink">Kitchen sink</Link>
      </li>
      <li>
        <Link to="/manuscript/plos">PLOS</Link>
      </li>
    </ul>
  </React.Fragment>
)

export default Dashboard

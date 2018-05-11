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
        <Link to="/manuscript?archiveId=bmj-10.1136-bmjgh-2017-000634.xml">
          BMJ
        </Link>
      </li>
      <li>
        <Link to="/manuscript?archiveId=elife-32671-v2.xml">eLife</Link>
      </li>
      <li>
        <Link to="/manuscript?archiveId=hindawi-10.1155-2017-8479487.xml">
          Hindawi
        </Link>
      </li>
      <li>
        <Link to="/manuscript?archiveId=plos-10.1371-journal.pone.0193088.xml">
          PLOS
        </Link>
      </li>
    </ul>
  </React.Fragment>
)

export default Dashboard

import React from 'react'
import ButtonLink from '../ui/atoms/ButtonLink'

const Dashboard = () => (
  <div>
    <h1>Dashboard Dummy Page</h1>
    <ButtonLink data-test-id="submit" primary to="/submit">
      Submit a manuscript
    </ButtonLink>
  </div>
)

export default Dashboard

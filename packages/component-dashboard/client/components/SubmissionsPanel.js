import React from 'react'
import DashboardList from './DashboardList'
import { ALL_MANUSCRIPTS } from '../graphql/queries'
import ManuscriptsQuery from './ManuscriptsQuery'

const SubmissionsPanel = () => (
  <ManuscriptsQuery query={ALL_MANUSCRIPTS}>
    <DashboardList />
  </ManuscriptsQuery>
)

export default SubmissionsPanel

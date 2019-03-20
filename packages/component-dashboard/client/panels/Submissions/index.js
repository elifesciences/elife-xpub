import React from 'react'
import DashboardList from '../../components/DashboardList'
import { ALL_MANUSCRIPTS } from '../../graphql/queries'
import ManuscriptsQuery from '../../ManuscriptsQuery'

const Submissions = () => (
  <ManuscriptsQuery query={ALL_MANUSCRIPTS}>
    <DashboardList />
  </ManuscriptsQuery>
)

export default Submissions

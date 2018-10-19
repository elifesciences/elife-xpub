import React from 'react'
import DashboardList from '../../../../ui/molecules/DashboardList'
import { ALL_MANUSCRIPTS } from '../../operations'
import ManuscriptsQuery from '../../ManuscriptsQuery'

const Submissions = () => (
  <ManuscriptsQuery query={ALL_MANUSCRIPTS}>
    <DashboardList />
  </ManuscriptsQuery>
)

export default Submissions

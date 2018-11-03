import React from 'react'
import DashboardList from '../../../../ui/molecules/DashboardList'
import { ALL_MANUSCRIPTS } from '../../operations'
import ManuscriptsQuery from '../../ManuscriptsQuery'

const Admin = () => (
  <ManuscriptsQuery query={ALL_MANUSCRIPTS} variables={{ belongingTo: '*' }}>
    <DashboardList />
  </ManuscriptsQuery>
)

export default Admin

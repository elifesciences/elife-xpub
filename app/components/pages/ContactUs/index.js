import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SideNavLayout from '../../global/layout/SideNavLayout'
import ContactELife from './ContactELife'
import EditorialStaff from './EditorialStaff'
import ProductionStaff from './ProductionStaff'

const ContactUs = ({ match, ...props }) => (
  <SideNavLayout
    navList={[
      { label: 'Contact eLife', link: '/contact-us/contact-elife' },
      { label: 'Editorial Staff', link: '/contact-us/editorial-staff' },
      { label: 'Production Staff', link: '/contact-us/production-staff' },
    ]}
    {...props}
  >
    <Switch>
      <Route component={ContactELife} exact path="/contact-us/contact-elife" />
      <Route
        component={EditorialStaff}
        exact
        path="/contact-us/editorial-staff"
      />
      <Route
        component={ProductionStaff}
        exact
        path="/contact-us/production-staff"
      />
      <Redirect exact from="/contact-us" to="/contact-us/contact-elife" />
    </Switch>
  </SideNavLayout>
)

export default ContactUs

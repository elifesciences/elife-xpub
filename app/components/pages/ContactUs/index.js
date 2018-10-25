import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SideNavLayout from '../../global/layout/SideNavLayout'
import ContactELife from './ContactELife'

// TODO: Add other 2 sub-components, once built

const ContactUs = ({ match, ...props }) => (
  <SideNavLayout
    navList={[{ label: 'Contact eLife', link: '/contact-us/contact-elife' }]}
    {...props}
  >
    <Switch>
      <Route component={ContactELife} exact path="/contact-us/contact-elife" />
      <Redirect exact from="/contact-us" to="/contact-us/contact-elife" />
    </Switch>
  </SideNavLayout>
)

export default ContactUs

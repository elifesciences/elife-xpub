import React from 'react'

import StaticPage from '../.'
import ContactELife from './ContactELife'
import EditorialStaff from './EditorialStaff'
import ProductionStaff from './ProductionStaff'

const ContactUs = props => (
  <StaticPage
    navList={[
      {
        label: 'Contact eLife',
        link: '/contact-us/contact-elife',
        component: ContactELife,
      },
      {
        label: 'Editorial Staff',
        link: '/contact-us/editorial-staff',
        component: EditorialStaff,
      },
      {
        label: 'Production Staff',
        link: '/contact-us/production-staff',
        component: ProductionStaff,
      },
    ]}
    {...props}
  />
)

export default ContactUs

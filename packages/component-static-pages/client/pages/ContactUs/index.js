import React from 'react'

import Layout from '../../components/Layout'
import ContactELife from './ContactELife'
import EditorialStaff from './EditorialStaff'
import ProductionStaff from './ProductionStaff'

const ContactUs = props => (
  <Layout
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

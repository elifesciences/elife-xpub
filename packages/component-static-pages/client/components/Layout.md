```js
const ContactELife = require('../pages/ContactUs/ContactELife').default
const EditorialStaff = require('../pages/ContactUs/EditorialStaff').default
const ProductionStaff = require('../pages/ContactUs/ProductionStaff').default
;<Layout
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
/>
```

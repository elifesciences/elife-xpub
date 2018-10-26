```js
const ContactELife = require('./ContactUs/ContactELife')
const EditorialStaff = require('./ContactUs/EditorialStaff')
const ProductionStaff = require('./ContactUs/ProductionStaff')
;<StaticPage
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

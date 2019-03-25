import React from 'react'
import { H1 } from '@pubsweet/ui'

import StaffGrid from '../../components/StaffGrid'
import StaffCard from '../../components/StaffCard'

const ProductionStaff = () => (
  <React.Fragment>
    <H1>Production Staff</H1>
    <p>
      Our Editorial Staff are happy to help with any enquiries arising
      post-acceptance.
    </p>
    <StaffGrid>
      <StaffCard
        jobTitle="Senior Production Assistant"
        name="James Gilbert"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2017-07%2Fjames.jpg/0,81,1000,566/502,284/0/default.jpg"
        telephone="+44 [0]1223 855346"
      />
      <StaffCard
        jobTitle="Production Assistant"
        name="Molly Shrimpton"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2018-04%2Fmolly_copy.jpeg/0,103,1577,893/502,284/0/default.jpg"
        telephone="+44 [0]1223 855370"
      />
    </StaffGrid>
  </React.Fragment>
)

export default ProductionStaff

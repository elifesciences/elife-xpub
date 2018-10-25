import React from 'react'
import StaffGrid from '../../../ui/molecules/StaffGrid'
import StaffCard from '../../../ui/molecules/StaffCard'

const ProductionPage = () => (
  <React.Fragment>
    <h1>Production Staff</h1>
    <p>
      Our Editorial Staff are happy to help with any enquiries arising
      post-acceptance.
    </p>
    <StaffGrid>
      <StaffCard
        jobTitle="Senior Production Assistant"
        name="James Gilbert"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/james.jpg"
        telephone="+44 [0]1223 855346"
      />
      <StaffCard
        jobTitle="Production Assistant"
        name="Molly Shrimpton"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2018-04/molly_copy.jpeg"
        telephone="+44 [0]1223 855370"
      />
    </StaffGrid>
  </React.Fragment>
)

export default ProductionPage

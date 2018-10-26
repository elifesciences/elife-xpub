import React from 'react'
import StaffGrid from '../../ui/molecules/StaffGrid'
import StaffCard from '../../ui/molecules/StaffCard'

const EditorialPage = () => (
  <React.Fragment>
    <h1>Editorial Staff</h1>
    <p>
      Our Editorial Staff are happy to help with any enquiries arising before
      acceptance.
    </p>
    <StaffGrid>
      <StaffCard
        jobTitle="Editorial Manager"
        name="Wei Mun Chan"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/weimun.jpg"
        telephone="+44 [0]1223 855379"
      />
      <StaffCard
        jobTitle="Journal Development Editor"
        name="Maria Guerreiro"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/maria.jpg"
        telephone="+44 [0]1223 855376"
      />
      <StaffCard
        jobTitle="Senior Editorial Assistant"
        name="Susanna Richmond"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/susanna.jpg"
        telephone="+44 [0]1223 855377"
      />
      <StaffCard
        jobTitle="Editorial Assistant"
        name="Emma Smith"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2018-07/emmasmith.jpg"
        telephone="+44 [0]1223 750665"
      />
      <StaffCard
        jobTitle="Editorial Assistant"
        name="Milly McConnell"
        photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2018-07/millie.jpg"
        telephone="+44 [0]1223 855348"
      />
    </StaffGrid>
  </React.Fragment>
)

export default EditorialPage

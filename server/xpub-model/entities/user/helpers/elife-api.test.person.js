module.exports = {
  allDetails: {
    id: 'ca22ca22',
    type: {
      id: 'reviewing-editor',
      label: 'Reviewing Editor',
    },
    name: {
      surname: 'Surname',
      givenNames: 'Given Names',
      preferred: 'Given Names Surname',
      index: 'Surname, Given Names',
    },
    emailAddresses: [
      {
        value: 'person@email.com',
        access: 'restricted',
      },
    ],
    research: {
      focuses: ['protein synthesis', 'translational control'],
      expertises: [
        {
          id: 'chromosomes-gene-expression',
          name: 'Chromosomes and Gene Expression',
        },
      ],
    },
    affiliations: [
      {
        name: ['National Institute of Child Health and Human Development'],
        address: {
          formatted: ['United States'],
          components: {
            country: 'United States',
          },
        },
      },
    ],
  },
  minimumDetails: {
    id: 'ca22ca22',
    type: {
      id: 'reviewing-editor',
      label: 'Reviewing Editor',
    },
    name: {
      preferred: 'Given Names Surname',
      index: 'Surname, Given Names',
    },
  },
}

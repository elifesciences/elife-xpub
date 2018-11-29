`PeoplePickerLogic` uses a render prop to allow customising the layout.

Note that by spreading the `prop` parameter from the render prop function into
the `Buttons` and `Body` components as shown in the examples, you avoid the need
to update your code should the API change in future.

### Buttons above body

```js
const PeoplePickerBody = require('./PeoplePickerBody').default
const PeoplePickerButtons = require('./PeoplePickerButtons').default
const people = [
  {
    id: 1,
    name: 'Annie Badger',
    aff: 'A University',
    focuses: ['biophysics and structural biology', 'immunology'],
    expertises: ['Evolutionary Biology', 'Microbiology and Infectious Disease'],
  },
  {
    id: 2,
    name: 'Bobby Badger',
    aff: 'B College',
    focuses: ['cell biology'],
    expertises: [
      'Biochemistry and Chemical Biology',
      'Chromosomes and Gene Expression',
    ],
  },
  {
    id: 3,
    name: 'Chastity Badger',
    aff: 'C Institute',
    focuses: ['computational and systems biology'],
    expertises: [
      'Developmental Biology',
      'Stem Cells and Regenerative Medicine',
    ],
  },
  {
    id: 4,
    name: 'Dave Badger',
    aff: 'D Research Lab',
    focuses: ['auditory cognition'],
    expertises: ['Neuroscience', 'Pumpkins', 'Chaffinches'],
  },
]
;<PeoplePickerLogic
  initialSelection={[people[1]]}
  minSelection={2}
  maxSelection={3}
  onSubmit={selection => console.log(selection)}
  onCancel={() => console.log('cancelled')}
  people={people}
>
  {props => (
    <React.Fragment>
      <PeoplePickerButtons {...props} />
      <hr />
      <PeoplePickerBody {...props} />
    </React.Fragment>
  )}
</PeoplePickerLogic>
```

### Buttons below body

```js
const PeoplePickerBody = require('./PeoplePickerBody').default
const PeoplePickerButtons = require('./PeoplePickerButtons').default
const people = [
  {
    id: 1,
    name: 'Annie Badger',
    aff: 'A University',
    focuses: ['biophysics and structural biology', 'immunology'],
    expertises: ['Evolutionary Biology', 'Microbiology and Infectious Disease'],
  },
  {
    id: 2,
    name: 'Bobby Badger',
    aff: 'B College',
    focuses: ['cell biology'],
    expertises: [
      'Biochemistry and Chemical Biology',
      'Chromosomes and Gene Expression',
    ],
  },
  {
    id: 3,
    name: 'Chastity Badger',
    aff: 'C Institute',
    focuses: ['computational and systems biology'],
    expertises: [
      'Developmental Biology',
      'Stem Cells and Regenerative Medicine',
    ],
  },
  {
    id: 4,
    name: 'Dave Badger',
    aff: 'D Research Lab',
    focuses: ['auditory cognition'],
    expertises: ['Neuroscience', 'Pumpkins', 'Chaffinches'],
  },
]
;<PeoplePickerLogic
  initialSelection={[people[1]]}
  minSelection={2}
  maxSelection={3}
  onSubmit={selection => console.log(selection)}
  onCancel={() => console.log('cancelled')}
  people={people}
>
  {props => (
    <React.Fragment>
      <PeoplePickerBody {...props} />
      <hr />
      <PeoplePickerButtons {...props} />
    </React.Fragment>
  )}
</PeoplePickerLogic>
```

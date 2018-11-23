`PeoplePicker` uses a render prop to allow customising the layout.

### Buttons above body

```js
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
;<PeoplePicker
  initialSelection={[people[1]]}
  minSelection={2}
  maxSelection={3}
  onSubmit={selection => console.log(selection)}
  people={people}
>
  {props => (
    <React.Fragment>
      <PeoplePicker.Buttons {...props} />
      <hr />
      <PeoplePicker.Body {...props} />
    </React.Fragment>
  )}
</PeoplePicker>
```

Note that by spreading the `prop` parameter from the render prop function into
the `Buttons` and `Body` components as shown in the example, you avoid the need
to update your code should the API change in future.

### Body only

```js
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

const selection = people.slice(0, 2)
;<PeoplePicker.Body
  isSelected={person => selection.includes(person)}
  maxSelection={5}
  minSelection={3}
  people={people}
  selection={selection}
  toggleSelection={person => console.log(person)}
/>
```

### Buttons only

```js
;<PeoplePicker.Buttons isValid={true} />
```

A people picker in a modal

```js
initialState = { open: false }
const people = [
  {
    id: 1,
    name: 'Annie Badger',
    aff: 'A University',
    subjectAreas: ['cell biology'],
  },
  {
    id: 2,
    name: 'Bobby Badger',
    aff: 'B College',
    subjectAreas: ['biochemistry and chemical', 'biology'],
  },
  {
    id: 3,
    name: 'Chastity Badger',
    aff: 'C Institute',
    subjectAreas: ['ecology'],
  },
  {
    id: 4,
    name: 'Dave Badger',
    aff: 'D Research Lab',
    subjectAreas: ['neuroscience'],
  },
]
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>

  <PeoplePickerModal
    maxSelection={3}
    minSelection={2}
    open={state.open}
    onCancel={() => setState({ open: false })}
    onSubmit={selection => {
      console.log('Selected', selection)
      setState({ open: false })
    }}
    people={people}
  />
</div>
```

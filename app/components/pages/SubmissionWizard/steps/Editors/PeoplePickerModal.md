A people picker in a modal

```js
initialState = { open: false }
const people = [
  {
    id: 1,
    name: 'Annie Badger',
    institution: 'A University',
    keywords: 'cell biology',
  },
  {
    id: 2,
    name: 'Bobby Badger',
    institution: 'B College',
    keywords: 'biochemistry and chemical biology',
  },
  {
    id: 3,
    name: 'Chastity Badger',
    institution: 'C Institute',
    keywords: 'ecology',
  },
  {
    id: 4,
    name: 'Dave Badger',
    institution: 'D Research Lab',
    keywords: 'neuroscience',
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

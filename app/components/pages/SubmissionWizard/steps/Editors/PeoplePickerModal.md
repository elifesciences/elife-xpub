A people picker in a modal

```js
initialState = { open: false }
const people = [
  { id: 1, name: 'Annie' },
  { id: 2, name: 'Bobby' },
  { id: 3, name: 'Chastity' },
  { id: 4, name: 'Dave' },
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

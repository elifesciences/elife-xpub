A people picker in a modal

**Search box behaviour within the People Picker**

Upon opening the People Picker Modal, the search box is empty.

Currently the user can only search by name.

Input generates a dropdown list of suggested matches by first letter of either first, middle or last name.

The suggestion list is further refined with additional user input.

Selecting a match from the dropdown populates the search box and updates the people pods returned.

Alternatively, the user can elect to search for any full or partial name already entered without choosing from the dropdown list. This returns all matching person pods.

The dropdown list is keyboard-navigable.

Searching for an empty string returns all person pods.

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

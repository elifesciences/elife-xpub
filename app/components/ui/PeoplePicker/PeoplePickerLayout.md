Please note: the PeoplePicker is a combination of the `PeoplePickerLayout` (how it's rendered) & the `PeoplePickerLogic` (how the sub-components interact)

The People Picker Layout is responsible for rendering the `PeoplePickerBody`, `PeoplePickerButtons` & `SearchBox` in eLife's chosen order - search at the top, then grid, then buttons below.

**Search box behaviour within the People Picker**

Upon opening the People Picker Modal, the search box is empty.

The user can search by name, affiliation or subject areas.

To update the list of peron pods the user has to press enter or click on the search icon after typing something.

Searching for an empty string returns all person pods.

Currently the input won't generate a dropdown list of suggestions (but will at some point in the future).

```js
initialState = { open: false }
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
    focuses: ['biophysics and structural biology', 'immunology'],
    expertises: ['Evolutionary Biology', 'Microbiology and Infectious Disease'],
  },
  {
    id: 3,
    name: 'Chastity Badger',
    aff: 'C Institute',
    focuses: ['biophysics and structural biology', 'immunology'],
    expertises: ['Evolutionary Biology', 'Microbiology and Infectious Disease'],
  },
  {
    id: 4,
    name: 'Dave Badger',
    aff: 'D Research Lab',
    focuses: ['biophysics and structural biology', 'immunology'],
    expertises: ['Evolutionary Biology', 'Microbiology and Infectious Disease'],
  },
]
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>

  <PeoplePickerLayout
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

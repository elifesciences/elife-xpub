`PeoplePicker` uses a render prop to allow customising the layout.

### Buttons above body

```js
const people = [
  { id: 1, name: 'Annie Badger', institution: 'A University' },
  { id: 2, name: 'Bobby Badger', institution: 'B College' },
  { id: 3, name: 'Chastity Badger', institution: 'C Institute' },
  { id: 4, name: 'Dave Badger', institution: 'D Research Lab' },
]
;<PeoplePicker
  minSelection="2"
  maxSelection="3"
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

### Body only

```js
const people = [
  { id: 1, name: 'Annie' },
  { id: 2, name: 'Bobby' },
  { id: 3, name: 'Chastity' },
  { id: 4, name: 'Dave' },
]
;<PeoplePicker.Body
  people={people}
  selection={[]}
  isSelected={() => false}
  toggleSelection={person => console.log(person)}
/>
```

### Buttons only

```js
;<PeoplePicker.Buttons isValid={true} />
```

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
  { id: 1, name: 'Annie' },
  { id: 2, name: 'Bobby' },
  { id: 3, name: 'Chastity' },
  { id: 4, name: 'Dave' },
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

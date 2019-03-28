Search box

```js
<SearchBox
  options={[
    { value: 'first option' },
    { value: 'final option' },
    { value: 'second option' },
  ]}
  filterFunction={(people, searchValue, field) => {
    if (!searchValue) return people

    const inputValue = searchValue.trim().toLowerCase()
    if (!inputValue) return people

    return people.filter(person =>
      person[field].toLowerCase().includes(inputValue),
    )
  }}
  getMatchIndex={(inputValue, option) => {
    const re = new RegExp(escapeRegExp(inputValue))
    const match = re.exec(option.toLowerCase())
    if (match) return match.index
    return -1
  }}
  onSubmit={() => console.log('submitted')}
/>
```

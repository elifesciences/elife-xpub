Search box

```js
initialState = { value: '' }
;<SearchBox
  options={[
    { value: 'first', label: 'first option' },
    { value: 'second', label: 'second option' },
  ]}
  value={state.value}
  onChange={event => setState({ value: event.target.value })}
/>
```

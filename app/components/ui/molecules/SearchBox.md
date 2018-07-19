Search box

```js
initialState = { value: '' }
;<SearchBox
  value={state.value}
  onChange={event => setState({ value: event.target.value })}
/>
```

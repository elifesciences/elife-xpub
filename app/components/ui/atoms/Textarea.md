initialState = { value: '' }

```js
<Textarea
  label="Label"
  value={state.value}
  placeholder="Placeholder"
  onChange={event => setState({ value: event.target.value })}
/>
```

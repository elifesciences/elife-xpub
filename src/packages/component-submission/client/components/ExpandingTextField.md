A form input for plain text that expands vertically when overflowing.

```js
initialState = { value: '' }
;<ExpandingTextField
  value={state.value}
  placeholder="so you can write some in here"
  onChange={event => setState({ value: event.target.value })}
/>
```

The ExpandingTextField can have a maximum number of rows defined.

```js
initialState = { value: '' }
;<ExpandingTextField
  label="Foo"
  maxRows={3}
  value={state.value}
  placeholder="so you can write some in here"
  onChange={event => setState({ value: event.target.value })}
/>
```

The ExpandingTextField can have a minumum number of rows defined as well.

```js
initialState = { value: '' }
;<ExpandingTextField
  label="Foo"
  minRows={5}
  value={state.value}
  placeholder="so you can write some in here"
  onChange={event => setState({ value: event.target.value })}
/>
```

A people picker in a modal

```js
initialState = { open: false }
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>

  <PeoplePickerModal
    open={state.open}
    onRequestClose={() => setState({ open: false })}
  />
</div>
```

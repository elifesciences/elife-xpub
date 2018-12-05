Modal containing full information about a person - for use within the PersonPod inside the PeoplePicker

```js
initialState = {
  open: false,
  selected: false,
}
;<div>
  <p>Person has been selected: {state.selected ? 'true' : 'false'}</p>
  <button onClick={() => setState({ open: true })}>Full Person Info</button>
  <PersonInfoModal
    isSelected={state.selected}
    onAccept={() => setState({ open: false, selected: true })}
    onCancel={() => {
      setState({ open: false })
    }}
    name="Michael J Frank"
    institution="Max Planck Institute, Germany"
    focuses={[
      'genetics of global gene expression',
      'mouse models of human disease',
      'haematology',
    ]}
    expertises={['Neuroscience', 'Cell Biology']}
    open={state.open}
  />
</div>
```

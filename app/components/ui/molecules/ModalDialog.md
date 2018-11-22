White modal dialog in the centre of the viewport, surrounded by greyed-out background

Plain modal:

```js
const FormH2 = require('../atoms/FormHeadings.js').FormH2
initialState = {
  open: false,
}
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>
  <ModalDialog
    acceptText="Yeeeeah"
    cancelText="woah now"
    onAccept={() => {
      setState({ open: false })
    }}
    onCancel={() => setState({ open: false })}
    open={state.open}
    size={state.size}
  >
    <FormH2>Title</FormH2>
    <p>This is a dialog box</p>
    <p>
      In this work, we prove the understanding of lambda calculus, which
      embodies the practical principles of cryptography.
    </p>
    <p>
      Set modal <code>size</code>{' '}
      <select
        onChange={e => {
          setState({ size: e.target.value })
        }}
      >
        <option>s</option>
        <option>m</option>
        <option>l</option>
      </select>
    </p>
  </ModalDialog>
</div>
```

PersonInfo modal:

```js
const PersonInfo = require('../atoms/PersonInfo.js').default
initialState = {
  open: false,
  personAdded: false,
}
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>
  <p> Person added: {state.personAdded ? 'true' : 'false'}</p>
  <ModalDialog
    acceptText="Add person"
    cancelText="Cancel"
    onAccept={() => {
      setState({ personAdded: true, open: false })
    }}
    onCancel={() => setState({ open: false })}
    open={state.open}
    size={state.size}
  >
    <PersonInfo
      person={{
        id: '1234',
        name: 'Michael J Frank',
        aff: 'Max Planck Institute, Germany',
        subjectAreas: [
          'genetics of global gene expression',
          'mouse models of human disease',
          'haematology',
        ],
      }}
    />
  </ModalDialog>
</div>
```

White modal dialog in the centre of the viewport, surrounded by greyed-out background. You are able to put whatever content you want inside.

Child is just a div with a fixed height:

```js
const FormH2 = require('../atoms/FormHeadings.js').FormH2
initialState = {
  open: false,
  accepted: false,
}
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>
  <p>Accepted in modal: {state.accepted ? 'true' : 'false'}</p>
  <ModalDialog
    acceptText="Yes"
    cancelText="No"
    onAccept={() => {
      setState({ open: false, accepted: true })
    }}
    onCancel={() => setState({ open: false })}
    open={state.open}
    size={state.size}
  >
    <div style={{ height: '500px' }} />
  </ModalDialog>
</div>
```

Children are various headings & paragraph elements:

```js
const FormH2 = require('../atoms/FormHeadings.js').FormH2
initialState = {
  open: false,
}
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>
  <ModalDialog
    acceptText="Click meeee"
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

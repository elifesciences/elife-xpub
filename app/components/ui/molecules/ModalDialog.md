White modal dialog in the centre of the viewport, surrounded by greyed-out background

```js
const FormH2 = require('../atoms/FormHeadings.js').FormH2
;<div>
  <button onClick={() => setState({ open: true })}>Open</button>
  <ModalDialog
    acceptText="Yeeeeah"
    cancelText="woah now"
    onAccept={() => {
      console.log('accepted')
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

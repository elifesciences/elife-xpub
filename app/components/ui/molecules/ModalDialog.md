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
    transparentBackground={true}
  >
    <FormH2>Title</FormH2>
    <p>This is a dialog box</p>
    <p>This is a dialog box</p>
    <p>This is a dialog box</p>
    <p>This is a dialog box</p>
  </ModalDialog>
</div>
```

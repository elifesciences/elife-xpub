Awaiting file

```js
const onDrop = files => console.log(files)
;<FileUpload onDrop={onDrop} />
```

Conversion completed

```js
const onDrop = files => console.log(files)
const conversion = { completed: true }
;<FileUpload onDrop={onDrop} conversion={conversion} />
```

Conversion failed (server side)

```js
const onDrop = files => console.log(files)
const conversion = { error: new Error('Conversion failed') }
;<FileUpload onDrop={onDrop} conversion={conversion} />
```

Conversion failed (form validation on client side)

```js
const onDrop = files => console.log(files)
const formError = 'Please upload manuscript'
;<FileUpload onDrop={onDrop} formError={formError} />
```

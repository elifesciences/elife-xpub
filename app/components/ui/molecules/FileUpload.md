Awaiting file

```js
const onDrop = files => console.log(files)
const conversion = {}
const formError = null
;<FileUpload onDrop={onDrop} conversion={conversion} formError={formError} />
```

Conversion completed

```js
const onDrop = files => console.log(files)
const conversion = { completed: true }
const formError = null
;<FileUpload onDrop={onDrop} conversion={conversion} formError={formError} />
```

Conversion failed (server side)

```js
const onDrop = files => console.log(files)
const conversion = { error: new Error('Conversion failed') }
const formError = null
;<FileUpload onDrop={onDrop} conversion={conversion} formError={formError} />
```

Conversion failed (form validation on client side)

```js
const onDrop = files => console.log(files)
const conversion = {}
const formError = { error: new Error('Please upload manuscript') }
;<FileUpload onDrop={onDrop} conversion={conversion} formError={formError} />
```

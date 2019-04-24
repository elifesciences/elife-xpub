Awaiting file

```js
const onDrop = files => console.log(files)
;<ManuscriptUpload onDrop={onDrop} />
```

Conversion completed

```js
const onDrop = files => console.log(files)
const conversion = { completed: true }
;<ManuscriptUpload onDrop={onDrop} conversion={conversion} />
```

Conversion failed (server side)

```js
const onDrop = files => console.log(files)
const conversion = { error: new Error('Conversion failed') }
;<ManuscriptUpload onDrop={onDrop} conversion={conversion} />
```

Conversion failed (form validation on client side)

```js
const onDrop = files => console.log(files)
const formError = 'Please upload manuscript'
;<ManuscriptUpload onDrop={onDrop} formError={formError} />
```

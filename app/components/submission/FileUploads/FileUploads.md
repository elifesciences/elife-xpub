A set of controls for uploading files

```js
const { Formik } = formik
const { schema, empty } = require('./FileUploadsSchema')
;<Formik
  initialValues={empty}
  onSubmit={data => console.log(data)}
  validationSchema={schema}
>
  {({ setFieldValue, errors, ...props }) => (
    <FileUploads
      conversion={{
        error: errors.manuscriptUrl && new Error(errors.manuscriptUrl),
      }}
      onDrop={([file]) => console.log('Dropped file', file)}
      setFieldValue={setFieldValue}
      {...props}
    />
  )}
</Formik>
```

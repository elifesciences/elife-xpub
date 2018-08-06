A form step for uploading a manuscript and writing the cover letter

```js
const { Formik } = formik
const { schema } = require('./schema')
const empty = {
  coverLetter:
    '<p><b>How do you feel about writing cover letters?</b></p><p></p>',
}
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

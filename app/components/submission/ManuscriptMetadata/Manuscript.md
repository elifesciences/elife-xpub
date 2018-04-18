A form for entering metadata about the article being submitted e.g. title, type, etc.

```js
const { Formik } = formik
const { schema, empty } = require('./ManuscriptSchema')
;<Formik
  component={Manuscript}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

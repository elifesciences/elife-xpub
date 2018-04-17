A form for entering personal information about the author of the paper being submitted.

```js
const { Formik } = formik
const { schema, empty } = require('./AuthorDetailsSchema')
;<Formik
  component={AuthorDetails}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

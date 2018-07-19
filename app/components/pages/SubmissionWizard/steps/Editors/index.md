```js
const { Formik } = formik
const { schema, empty } = require('./schema')
;<Formik
  component={ReviewerSuggestions}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

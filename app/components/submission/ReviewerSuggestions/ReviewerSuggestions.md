```js
const { Formik } = formik
const { schema, empty } = require('./ReviewerSuggestionsSchema')
;<Formik
  component={ReviewerSuggestions}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

A form for entering personal information about the author of the paper being submitted.

```js
const { Formik } = formik
const validationSchema = require('./AuthorDetailsSchema').default
;<Formik
  component={AuthorDetails}
  initialValues={{
    firstName: '',
    lastName: '',
    email: '',
    institute: '',
    assignee: null,
  }}
  onSubmit={values => console.log(values)}
  validationSchema={validationSchema}
/>
```

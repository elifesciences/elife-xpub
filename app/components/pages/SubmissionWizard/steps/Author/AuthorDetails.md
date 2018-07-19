A form for entering personal information about the author of the paper being
submitted.

```js
const { Formik } = formik
const { schema } = require('./schema')

const empty = {
  submissionMeta: {
    author: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
    },
  },
}
;<Formik
  component={AuthorDetails}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

Loading orcid data

```js
const { Formik } = formik
;<Formik render={props => <AuthorDetails loading={true} {...props} />} />
```

Loading orcid data failed

```js
const { Formik } = formik
;<Formik
  render={props => (
    <AuthorDetails error="ORCID is down for maintenance" {...props} />
  )}
/>
```

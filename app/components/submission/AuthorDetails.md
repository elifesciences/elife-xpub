A form for entering personal information about the author of the paper being submitted.

```js
const { Formik } = formik
;<Formik
  initialValues={{
    firstName: 'Todd',
    lastName: 'Bonzalez',
    email: 'todd.bonzalez@gmail.com',
    institute: 'University of eLife',
    assignee: {},
  }}
  render={props => <AuthorDetails {...props} />}
  onSubmit={values => console.log(values)}
/>
```

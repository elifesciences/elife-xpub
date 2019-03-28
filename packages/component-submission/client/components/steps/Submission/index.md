A form for entering metadata about the article being submitted e.g. title, type,
etc.

```js
const { Formik } = formik
const { schema } = require('./schema')
const empty = {
  meta: {
    title: '',
    articleType: '',
    subjects: [],
  },
  previouslyDiscussed: null,
  previouslySubmitted: [],
  cosubmission: [],
}
;<Formik
  component={SubmissionPage}
  initialValues={empty}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

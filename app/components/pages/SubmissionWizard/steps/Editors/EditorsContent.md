```js
const { Formik } = formik
const { schema } = require('./schema')
const data = {
  suggestedSeniorEditors: [
    { id: 1, name: 'Alfred Badger', institution: 'Institute of Badgers' },
  ],
  opposedSeniorEditors: [
    { id: 3, name: 'Charlie Badger', institution: 'Badger University' },
  ],
  suggestedReviewingEditors: [],
  opposedReviewingEditors: [],
  suggestedReviewers: [
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ],
  opposedReviewers: [],
  noConflictOfInterest: false,
}
;<Formik
  component={ReviewerSuggestions}
  initialValues={data}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

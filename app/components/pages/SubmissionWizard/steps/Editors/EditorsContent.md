```js
const { Formik } = formik
const { schema } = require('./schema')
const data = {
  suggestedSeniorEditors: [
    {
      id: 1,
      name: 'Alfred Badger',
      aff: 'Institute of Badgers',
      subjectAreas: ['Human Biology and Medicine', 'Neuroscience'],
    },
  ],
  opposedSeniorEditors: [
    {
      id: 3,
      name: 'Charlie Badger',
      aff: 'Badger University',
      subjectAreas: ['Cell Biology'],
    },
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
  render={formProps => (
    <EditorsContent
      history={{ location: {} }}
      seniorEditors={[]}
      reviewingEditors={[]}
      {...formProps}
    />
  )}
  initialValues={data}
  onSubmit={values => console.log(values)}
  validationSchema={schema}
/>
```

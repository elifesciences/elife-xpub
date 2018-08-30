A form for the author to suggest

- which senior editors, reviewing editors & reviewers they would like to be assigned to review their manuscript
- certain people that should be excluded from the review & a reason as to why

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
  opposedReviewersReason: '',
  noConflictOfInterest: false,
}
;<Formik
  render={formProps => (
    <EditorsPage
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

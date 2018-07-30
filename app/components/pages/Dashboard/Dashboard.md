## Dashboard Component

```js
;<Dashboard
  manuscripts={[
    { id: 1, title: 'Something interesting', submissionMeta: { stage: 'QC' } },
  ]}
  deleteManuscript={id => console.log('delete', id)}
/>
```

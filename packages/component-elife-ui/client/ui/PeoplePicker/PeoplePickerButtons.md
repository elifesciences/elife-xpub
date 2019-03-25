Add button is disabled by default:

```js
;<PeoplePickerButtons
  onCancel={() => console.log('cancelled')}
  onSubmit={() => console.log('submitted')}
/>
```

The `isValid` prop can be used to make the button clickable again:

```js
;<PeoplePickerButtons
  isValid={true}
  onCancel={() => console.log('cancelled')}
  onSubmit={() => console.log('submitted')}
/>
```

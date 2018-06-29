Required props:

* `label`: for accessibility purposes
* `value` & `onChange`: to make this a controlled React component

Note: other CSS properties for an input element may be passed in (e.g. placeholder) but are not required.

```js
<Textarea
  label="Label"
  onChange={event => setState({ value: event.target.value })}
  placeholder="Placeholder"
  value={state.value}
/>
```

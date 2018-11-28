Defines the size and layout for all types of pod (i.e. PersonPod or ChooserPod) & encapsulates the following aspects:

- children render on the left-hand side
- button on right-hand side

Props:

- `isSelectButtonClickable` - defines whether button is clickable or diabled
- `selectButtonType` - 3 possible options: 'add', 'remove' or 'selected'
- `togglePersonSelection` - can be used to alter the button type

### Examples of different button states

(with an empty div as children, so there is nothing on the left-hand side)

Button is always 'add':

```js
<PodContainer
  isSelectButtonClickable={true}
  togglePersonSelection={() => console.log('toggled')}
  selectButtonType="add"
>
  <div />
</PodContainer>
```

Button is always 'remove':

```js
<PodContainer
  isSelectButtonClickable={true}
  togglePersonSelection={() => console.log('toggled')}
  selectButtonType="remove"
>
  <div />
</PodContainer>
```

Button is always 'selected':

```js
<PodContainer
  isSelectButtonClickable={true}
  togglePersonSelection={() => console.log('toggled')}
  selectButtonType="selected"
>
  <div />
</PodContainer>
```

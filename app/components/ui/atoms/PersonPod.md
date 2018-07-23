### ChosenPersonPod

Clickable keywords:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={true}
  onKeywordClick={() => console.log('keyword clicked')}
  isStatusShown={false}
  iconState="add"
  onIconClick={() => console.log('icon clicked')}
/>
```

Showing the person's status:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={true}
  onKeywordClick={() => console.log('keyword clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="add"
  onIconClick={() => console.log('icon clicked')}
/>
```

Removal icon:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={false}
  onKeywordClick={() => console.log('keyword clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="remove"
  onIconClick={() => console.log('icon clicked')}
/>
```

Selected icon:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={false}
  onKeywordClick={() => console.log('keyword clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="selected"
  onIconClick={() => console.log('icon clicked')}
/>
```

Disabled:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={false}
  onKeywordClick={() => console.log('keyword clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="add"
  isIconClickable={false}
  onIconClick={() => console.log('icon clicked')}
/>
```

### ChoosePersonPod

```js
<PersonPod.SelectButton
  role="Senior Editor(s)"
  isRequired={true}
  onIconClick={() => console.log('icon clicked')}
/>
```

```js
<PersonPod.SelectButton
  role="Reviewing Editor(s)"
  isRequired={false}
  onIconClick={() => console.log('icon clicked')}
/>
```

### ChosenPersonPod

Clickable keywords:

```js
<PersonPod
  name="Richard Aldrich"
  institution="Utrecht University"
  keywords="cell biology"
  isKeywordClickable={true}
  onKeywordClick={() => console.log('keyword clicked')}
  onIconClick={() => console.log('icon clicked')}
  isStatusShown={false}
  iconState="add"
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
  onIconClick={() => console.log('icon clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="add"
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
  onIconClick={() => console.log('icon clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="remove"
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
  onIconClick={() => console.log('icon clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="selected"
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
  onIconClick={() => console.log('icon clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconState="add"
  disabled
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

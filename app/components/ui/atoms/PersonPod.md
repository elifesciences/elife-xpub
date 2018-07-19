### ChosenPersonPod

Clickable keywords:

```js
<PersonPod.ChosenPersonPod
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
<PersonPod.ChosenPersonPod
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
<PersonPod.ChosenPersonPod
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
<PersonPod.ChosenPersonPod
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
<PersonPod.ChosenPersonPod
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
<PersonPod.ChoosePersonPod
  role="Senior Editor(s)"
  isRequired={true}
  onIconClick={() => console.log('icon clicked')}
/>
```

```js
<PersonPod.ChoosePersonPod
  role="Reviewing Editor(s)"
  isRequired={false}
  onIconClick={() => console.log('icon clicked')}
/>
```

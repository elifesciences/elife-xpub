### ChosenPersonPod

Clickable keywords:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="Utrecht University"
  focuses={['cell biology', 'biochemistry and chemical biology']}
  expertises={['Cellular Biology']}
  isKeywordClickable={true}
  onKeywordClick={keyword => console.log(keyword, 'clicked')}
  isStatusShown={false}
  iconType="add"
  onIconClick={() => console.log('icon clicked')}
/>
```

Showing the person's status:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="Utrecht University"
  focuses={['structural biology and molecular biophysics']}
  expertises={['Biochemistry and Chemical Biology', 'Plant Biology']}
  isKeywordClickable={false}
  status="Currently unavailable"
  isStatusShown={true}
  iconType="add"
  onIconClick={() => console.log('icon clicked')}
/>
```

Removal icon:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="National Centre for Biological Sciences, Tata Institute of Fundamental Research"
  focuses={['human biology and medicine']}
  expertises={['Neuroscience']}
  isKeywordClickable={false}
  onKeywordClick={() => console.log('keyword clicked')}
  status="Currently unavailable"
  isStatusShown={true}
  iconType="remove"
  onIconClick={() => console.log('icon clicked')}
/>
```

Selected icon:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="Utrecht University"
  focuses={[]}
  expertises={['Cell Biology']}
  isKeywordClickable={false}
  isStatusShown={true}
  iconType="selected"
  onIconClick={() => console.log('icon clicked')}
/>
```

Disabled:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="Utrecht University"
  focuses={['biological experiments']}
  expertises={['Cell Biology']}
  isKeywordClickable={false}
  iconType="add"
  isIconClickable={false}
/>
```

### SelectButton

```js
;<PersonPod.SelectButton
  role="Senior Editor(s)"
  isRequired={true}
  onIconClick={() => console.log('icon clicked')}
/>
```

```js
;<PersonPod.SelectButton
  role="Reviewing Editor(s)"
  isRequired={false}
  onIconClick={() => console.log('icon clicked')}
/>
```

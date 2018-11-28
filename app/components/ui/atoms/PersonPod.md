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
  isPicked={false}
  isStatusShown={false}
  iconType="add"
  togglePersonSelection={() => console.log('icon clicked')}
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
  isPicked={false}
  isStatusShown={true}
  iconType="add"
  togglePersonSelection={() => console.log('icon clicked')}
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
  isSelectedInForm={false}
  isStatusShown={true}
  iconType="remove"
  togglePersonSelection={() => console.log('icon clicked')}
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
  isSelectedInForm={false}
  isStatusShown={true}
  iconType="selected"
  togglePersonSelection={() => console.log('icon clicked')}
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
  isSelectedButtonClickable={false}
  isSelectedInForm={false}
  togglePersonSelection={() => console.log('icon clicked')}
/>
```

### SelectButton

```js
;<PersonPod.ChooserPod
  roleName="Senior Editor(s)"
  isRequired={true}
  togglePersonSelection={() => console.log('icon clicked')}
/>
```

```js
;<PersonPod.ChooserPod
  roleName="Reviewing Editor(s)"
  isRequired={false}
  togglePersonSelection={() => console.log('icon clicked')}
/>
```

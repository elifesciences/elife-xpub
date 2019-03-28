Clickable keywords:

```js
;<PersonPod
  name="Brian B Aldrich"
  institution="Utrecht University"
  focuses={['cell biology', 'biochemistry and chemical biology']}
  expertises={['Cellular Biology']}
  isKeywordClickable={true}
  onKeywordClick={keyword => console.log(keyword, 'clicked')}
  isSelected={false}
  isStatusShown={false}
  selectButtonType="add"
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
  isSelected={false}
  isStatusShown={true}
  selectButtonType="add"
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
  isSelected={false}
  isStatusShown={true}
  selectButtonType="remove"
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
  isSelected={false}
  isStatusShown={true}
  selectButtonType="selected"
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
  selectButtonType="add"
  isSelectedButtonClickable={false}
  isSelected={false}
  togglePersonSelection={() => console.log('icon clicked')}
/>
```

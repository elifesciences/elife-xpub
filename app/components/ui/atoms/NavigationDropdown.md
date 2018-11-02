```js
const options = [
  { label: 'Contact eLife', value: '/contact-us' },
  { label: 'Editorial staff', value: '/contact-us/editorial-staff' },
  { label: 'Production staff', value: '/contact-us/production-staff' },
]
let selectedOption = options[0]
const handleSelection = selectedItem => (selectedOption = selectedItem)
;<NavigationDropdown
  options={options}
  value={selectedOption.value}
  onSelection={handleSelection}
/>
```

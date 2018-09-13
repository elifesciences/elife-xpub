Used when you want your icon to be clickable, without sacrificing semantics & therefore accessibility.

A transparent HTML button (as opposed to our own Button component), whose size is defined by the icon that is put inside it.

```js
const { X } = require('react-feather')
;<ButtonAsIconWrapper onClick={() => console.log('clicked')}>
  <X />
</ButtonAsIconWrapper>
```

## Icons

### Adding icons from Material

eLife uses the Material icons library by default

To add a new Material icon into this codebase:

1.  Download the SVG from the [Material icons website](https://material.io/tools/icons/?style=baseline)
2.  Create a new JS file in [`elife-theme/icons/material`](https://github.com/elifesciences/elife-xpub/tree/develop/client/elife-theme/src/icons/material)
    - The filename the should correspond to the original Material icon's name (to avoid duplications)
    - Wrap the SVG in a React component & remember to spread props onto the SVG element itself
3.  Export this from the `icons` folder - [`elife-theme/icons/index.js`](https://github.com/elifesciences/elife-xpub/blob/develop/client/elife-theme/src/icons/index.js)

So the originally downloaded "Add" SVG:

```js
<svg
  height="24"
  viewBox="0 0 24 24"
  width="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  <path d="M0 0h24v24H0z" fill="none" />
</svg>
```

becomes the following React JS file:

```js
import React from 'react'

const Add = props => (
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

export default Add
```

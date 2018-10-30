Overall navigation bar for the app

When a user is not logged in:

```js
<AppBar
  menuItems={[
    { label: 'Author guide', link: '/author-guide' },
    { label: 'Reviewer guide', link: '/reviewer-guide' },
    { label: 'Contact us', link: '/contact-us' },
  ]}
/>
```

When a user is logged in:

```js
<AppBar
  menuItems={[
    { label: 'Author guide', link: '/author-guide' },
    { label: 'Reviewer guide', link: '/reviewer-guide' },
    { label: 'Contact us', link: '/contact-us' },
  ]}
  user="anyone"
/>
```

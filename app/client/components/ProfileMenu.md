User profile menu, for use in the AppBar

If a user is not provided (i.e. user is not logged in), we see a logout link:

```js
<ProfileMenu />
```

If a user is provided to the component (i.e. a user is logged in), we see the user profile icon:

```js
<div style={{ textAlign: 'right' }}>
  <ProfileMenu
    user={{ identities: [{ name: 'Joe Bloggs has a very long name' }] }}
  />
</div>
```

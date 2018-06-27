Notification ribbon that can be displayed at the top. It has 3 variations:

Generic/primary ribbon

```js
<NotificationRibbon type="primary">
  This is a generic notification ribbon
</NotificationRibbon>
```

Success ribbon

```js
<NotificationRibbon type="success">
  This is a success notification ribbon
</NotificationRibbon>
```

Error ribbon

```js
<NotificationRibbon type="error">
  This is an error notification ribbon
</NotificationRibbon>
```

Anchors also have a special style inside a ribbon

```js
<NotificationRibbon type="primary">
  <a onClick={() => console.log('resent!')}>Resend</a> verification email
</NotificationRibbon>
```

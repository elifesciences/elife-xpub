# Email Configuration

For testing and all environments except production we use the
[Ethereal is a fake SMTP service](https://ethereal.email). This is configured
within the file `config/non-serializable/fake-email.js` and is selected in the
`mailer` section of the main config.

[Check the inbox](https://ethereal.email/messages) from this page using the
login credentials stored in the `fake-email.js` file.

Developers can create their own account on
[this page](https://ethereal.email/create) to setup their own inbox.

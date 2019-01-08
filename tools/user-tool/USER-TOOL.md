# user-tool

A tool to help diagnose the values between xPub, Profiles Service and ORCID.

## Usage

You can specify the sandbox / staging environment by using the `-s` switch. All the following commands will then be directed at the appropriate services.

### profiles

You can get all the profiles from the Profiles Service by running:

```
node user-tool.js profiles
```

You can then pipe this into a search to look for names etc.
For, example looking for my profile information:

```
$ node user-tool.js profiles | grep Hooper
1qttans6, "Hooper, Peter", 0000-0003-3830-8230
9pyi76cl, "Hooper, Pleasant", 0000-0001-5746-9668
```

### get-profile

Now you have my profile id of `1qttans6`, this can be used to get the full information with:

```bash
node user-tool.js get-profile 1qttans6
```

returns:

```json
{
  "id": "1qttans6",
  "name": { "preferred": "Peter Hooper", "index": "Hooper, Peter" },
  "orcid": "0000-0003-3830-8230",
  "emailAddresses": [],
  "affiliations": []
}
```

Which will return all of the profile information, if you wish to see the `emailAddress` and `affiliations` you will need to configure the secret. See `Configuration` section.

### get-orcid

From the same search done above (using `get-profiles`) or from querying the individual profile (`get-profile xxxxxx`) you can find the `orcid`. This id can be used to query the ORCID service to get the details from a user stored by ORCID. For example:

```
node scripts/user-tool.js get-orcid 0000-0003-3830-8230
```

The output is not show as its quite verbose, things to watch for are things like the `visibility` field which can be set to `PRIVATE` for various fields you were expecting to see.

## Configuration

By convention please store the following in `~/.xpub_secrets`

```
export ELIFE_API_GATEWAY_SECRET=<get from staging/prod>
export ORCID_CLIENTID=<client id from staging/prod>
export ORCID_SECRET=<secret from staging/prod>
```

Before running any commands make sure these are source'ed into your shell with:

```
. ~/.xpub_secrets
```

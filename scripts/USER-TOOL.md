# user-tool

A tool to help diagnose the values between xPub, Profiles Service and ORCiD

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

You can use curl to test

```
curl -v -i -L -H "Accept: application/json" \
    -d "client_id=${ORCID_CLIENTID}" \
    -d "client_secret=${ORCID_SECRET}" \
    -d "scope=/read-public" \
    -d "grant_type=client_credentials" \
    "https://sandbox.orcid.org/oauth/token"
```

## Configuration

By convention please store the following in `~/.xpub_secrets`

```
export ELIFE_API_GATEWAY_SECRET=<get from staging>
export ORCID_CLIENTID=<secret>
export ORCID_SECRET=<secret>
```

Before running any commands make sure these are source'ed into your shell with:

```
. ~/.xpub_secrets
```

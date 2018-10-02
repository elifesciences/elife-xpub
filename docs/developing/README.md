# Local setup

Follow these instructions to run the app locally:

[PubSweet development setup](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/Development:-setup)

Visit the web interface at [http://localhost:3000].

### Dependencies

The application depends on S3. You can run a fake S3 server locally:
- Run `docker run -p 4569:4569 --rm lphoward/fake-s`
- Add the following to `config/local.js`
```
  aws: {
    s3: {
      endpoint: new AWS.Endpoint(`http://localhost:4569`),
    },
  }, 
```

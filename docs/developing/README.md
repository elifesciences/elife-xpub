# Local setup

Run these commands:

```
docker-compose up -d postgres
docker-compose run app /bin/bash -c "npx pubsweet setupdb --username=foo --password=password --email=foo@example.com --clobber"
docker-compose up
```

Visit the web interface at [http://localhost:3000].

> **TODO** Documentation for styleguide
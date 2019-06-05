 #!/bin/bash
 
echo "This relies on the following being run (see Jenkins): "
echo "    ln -sf .env.ci .env"

export PGHOST=postgres

docker rmi $(docker images -q -f dangling=true)

# Use this to force rebuild NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml build --no-cache app test_browser
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml build app test_browser

NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres api-dummy fakes3 sftp
gnome-terminal  --tab -t psql -- docker logs -f elifexpub_postres_1 

NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh sftp:22'
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh api-dummy:8080'
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh fakes3:4569'
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'node -e "console.log(require( \"config\" ).get(\"pubsweet-server.db\"))" '
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'npx pubsweet migrate'
NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d app
gnome-terminal  --tab -t app -- docker logs -f elifexpub_app_1 

NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run -p 10081:10081 --rm --name elife-xpub_app_test_browser test_browser


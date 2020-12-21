#!/bin/bash
echo "Don't forget to add '127.0.0.1 host.docker.internal' to your /etc/hosts."

docker run -d --name nextcloud1443 --env-file servers/nextcloud-server/env.list -p 1443:443 nextcloud-server
docker run -d --name nextcloud2443 --env-file servers/nextcloud-server/env.list -p 2443:443 nextcloud-server
docker run -d --name owncloud180 --env-file servers/owncloud-server/env-180.list -p 180:8080 owncloud-server
docker run -d --name owncloud280 --env-file servers/owncloud-server/env-280.list -p 280:8080 owncloud-server
until docker run --rm open-cloud-mesh curl -kI https://host.docker.internal:1443 2> /dev/null > /dev/null
do
  echo Waiting for https://host.docker.internal:1443 to start, this can take up to a minute ...
  sleep 1
done
echo Configuring nextcloud1443
docker exec -u www-data -it -e SERVER_ROOT=https://host.docker.internal:1443 nextcloud1443 sh /init.sh
docker exec -u root -it nextcloud1443 service apache2 reload

until docker run --rm open-cloud-mesh curl -kI https://host.docker.internal:2443 2> /dev/null > /dev/null
do
  echo Waiting for https://host.docker.internal:2443 to start, this can take up to a minute ...
  sleep 1
done
echo Configuring nextcloud1443
docker exec -u www-data -it -e SERVER_ROOT=https://host.docker.internal:2443 nextcloud2443 sh /init.sh
docker exec -u root -it nextcloud2443 service apache2 reload

echo Browse to https://host.docker.internal:1443 and log in as alice / alice123
echo Browse to https://host.docker.internal:2443 and log in as alice / alice123
echo Browse to http://host.docker.internal:180 and log in as admin / admin
echo Browse to http://host.docker.internal:280 and log in as admin / admin

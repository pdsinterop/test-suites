#!/bin/bash
docker run -d --name nextcloud --env-file servers/nextcloud-server/env.list -p 443:443 nextcloud-server
docker run -d --name owncloud --env-file servers/owncloud-server/env.list -p 8080:8080 owncloud-server
sleep 15
docker exec -u www-data -it -e SERVER_ROOT=https://server nextcloud sh /init.sh
docker exec -u root -it nextcloud service apache2 reload
echo Browse to https://localhost and log in as alice / alice123
echo Browse to http://localhost:8080 and log in as admin / admin


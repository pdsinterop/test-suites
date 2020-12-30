# OCM Test Suite
##
Run:
```sh
npm install
npm test
```

Debug:
```sh
npm install
npm run debug
```

## Start ownCloud
```sh
cd servers/owncloud-compose
vim .env
docker-compose up -d
```

## Start Nextcloud
```sh
docker build -t nextcloud-server servers/nextcloud-server/
docker run -d -e SERVER_ROOT=https://`hostname`.pdsinterop.net -p 443:443 -p 80:80 --name=server nextcloud-server
curl -kI https://`hostname`.pdsinterop.net
docker exec -u www-data -it -e SERVER_ROOT=https://`hostname`.pdsinterop.net server php console.php maintenance:install --admin-user alice --admin-pass alice123
docker exec -u www-data -it -e SERVER_ROOT=https://`hostname`.pdsinterop.net server sed -i "25 i\    1 => '`hostname`.pdsinterop.net'," config/config.php
docker exec -u root -it server service apache2 reload
docker exec -u root -it server certbot --apache
```

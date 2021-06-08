# OCM Test Suite
This test suite tests various implementations of [Open Cloud Mesh (OCM)](https://github.com/cs3org/OCM-API) against each other.

## Overview
```sh
docker build --name tester .
docker run --cap-add=SYS_ADMIN -it tester
```

It tests three flows:

### Public-link flow (login first)
In the public-link flow, the provider gives the consumer a public link, and the consumer clicks 'save to my personal cloud' on there.
In this flow, it is assumed that the consumer is already logged in to their personal cloud account before clicking 'save to my personal cloud' on the public link. After clicking, the consumer is redirected to their personal cloud account GUI, accepts the share, and then leaves it again.

### Public-link flow (login after)
Same as the previous flow, except the consumer is not logged in to their own personal cloud account yet when they get redirected to it
from the public link.

### Share-with flow
In this flow, the provider uses their own personal cloud account GUI to share a resource with the consumer, and the consumer notices this from the notification in their personal cloud acccount GUI, accepts the share, then leaves it again.

## Running the tester locally
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

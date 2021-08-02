# OCM Test Suite
This test suite tests various implementations of [Open Cloud Mesh (OCM)](https://github.com/cs3org/OCM-API) against each other.

## Overview
The following script runs the testnet on an empty Ubuntu server:
```sh
apt-het update -yq
apt-get install -yq    apt-transport-https     ca-certificates     curl     gnupg     lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo   "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -yq
apt-get install -yq docker-ce docker-ce-cli containerd.io
docker ps

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout wip-docker
git clone https://github.com/michielbdejong/ocm-stub
git clone https://github.com/cs3org/reva

./build.sh
docker network create testnet
docker run -d --network=testnet --name=nc1 nextcloud
docker run -d --network=testnet --name=nc2 nextcloud
# docker run --network=testnet --cap-add=SYS_ADMIN tester
docker run -p 5900:5900 --network=testnet -d tester

# set up port forwarding from host to testnet for vnc:
sysctl net.ipv4.ip_forward=1
# docker inspect exciting_einstein | grep IPAddress
iptables -t nat -A PREROUTING -p tcp -d 142.93.234.44 --dport 5900 -j DNAT --to-destination 172.18.0.2:5900
iptables -t nat -A POSTROUTING -j MASQUERADE
```
Then connect using VNC (e.g. open `vnc://dockerhost` in Safari), password 1234, you should see a black screen with a white rectangle in the top-left.
Type: `HEADLESS= ./node_modules/.bin/jest ocm.test.js --runInBand`

# docker-compose up
# docker logs -t ocm-test-suite_tester_1
# docker run -it --network=ocm-test-suite_default --cap-add=SYS_ADMIN --user=root tester /bin/bash
# docker start ocm-test-suite_nc1.docker_1
# docker run -d --network=ocm-test-suite_default --name=ocm-test-suite_nc1.docker_1 nextcloud
# docker exec -it --user=www-data ocm-test-suite_nc1.docker_1 /bin/bash
# $ export PHP_MEMORY_LIMIT="512M"
# $ php console.php maintenance:install --admin-user alice --admin-pass alice123
# $ php console.php status
# $ vim config/config.php +24 # add ocm-test-suite_nc1.docker_1 as a trusted domain
# $ exit
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

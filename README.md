# OCM Test Suite
This test suite tests various implementations of [Open Cloud Mesh (OCM)](https://github.com/cs3org/OCM-API) against each other.

## Overview
The following script runs the testnet on an empty Ubuntu server:
```sh
apt-get update
apt-get install -yq docker.io
docker ps

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout add-reva

git clone https://github.com/michielbdejong/ocm-stub
cd ocm-stub
git checkout adapt-to-revad
cd ..
git clone https://github.com/michielbdejong/reva
cd reva
git checkout pass-ocm-test-suite
cd ..

./build.sh
docker network create testnet
docker run -d --network=testnet --rm --name=nc1.docker nextcloud
docker run -d --network=testnet --rm --name=nc2.docker nextcloud
docker run -d --network=testnet --rm --name=stub1.docker stub
docker run -d --network=testnet --rm --name=stub2.docker stub
docker run -d --network=testnet --rm --name=revad1.docker revad
docker run -d --network=testnet --rm --name=revad2.docker revad
docker run -p 6080:80 -p 5900:5900 -v /dev/shm:/dev/shm --network=testnet --name=tester -d --cap-add=SYS_ADMIN tester

TESTER_IP_ADDR=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tester`
echo $TESTER_IP_ADDR
# set up port forwarding from host to testnet for vnc:
sysctl net.ipv4.ip_forward=1
iptables -t nat -A PREROUTING -p tcp --dport 5900 -j DNAT --to-destination $TESTER_IP_ADDR:5900
```

While still on the host system, run maintenance:install and set trusted domains in the Nextcloud servers:
```sh
docker exec -it --user=www-data nc1.docker /bin/bash
```
And then:
```sh
export PHP_MEMORY_LIMIT="512M"
php console.php maintenance:install --admin-user alice --admin-pass alice123
php console.php status
vim config/config.php +24 # add nc1.docker as a trusted domain
exit
```
And same for `nc2.docker`.

Then from your laptop connect using VNC (e.g. open `vnc://dockerhost` in Safari), password 1234, you should see an Ubuntu desktop.
You can test that you made it into the testnet by opening Start->Internet->Firefox Web Browser and browsing to https://nc1.docker, once you
click 'accept the risk and continue', you should be able to log in to Nextcloud with 'alice'/'alice123'.

### Known Issues
NB: We recently switched from vps-hosted to in-Docker, and the test suite is still a bit young.
We have successfully used it so far to test OCM between ownCloud and Nextcloud,
and between a stub server and Reva.
You can uncomment these in `./params-docker.js`.
What does not work yet is OCM between Nextcloud/ownCloud  and Reva. We are currently discussing how to move forward
from this situation. Please join https://gitter.im/cs3org/OCM and ping @michielbdejong if you want more up-to-date info and guidance.

Here are some known issues we're working on:

1. For both nc1.docker and nc2.docker, click the 'X' on the first-time-use splash screen (see https://github.com/cs3org/ocm-test-suite/issues/32).
2. When running public-link flow from NC for the first time since starting up the `nc1.docker` instance, you will have to manually click the '+' (see https://github.com/cs3org/ocm-test-suite/issues/33).
3. Only NC->NC public-link (login after) is currently being tested, the rest is commented out
4. Reva has been added but is not passing the tests yet, due to a few open issues:
  * https://github.com/cs3org/reva/issues/1752
  * https://github.com/cs3org/reva/issues/1753
  * https://github.com/cs3org/reva/issues/1962
  * https://github.com/cs3org/reva/issues/1981
5. Due to https://github.com/cs3org/ocm-test-suite/issues/34:
   * add `'allow_local_remote_servers' => true` to /var/www/html/config/config.php on nc1.docker.
   * add `'verify' => false` to /var/www/html/lib/private/Http/Client/ClientService.php line 75 on nc1.docker.
   * comment out line 79 of /var/www/html/lib/private/Http/Client/Client.php
   * even then it doesn't seem to work consistently yet.

Now to run the tests, open a terminal (Start->System Tools->LXTerminal) and type (sudo password for user 'tester' is '1234'):
```sh
/bin/bash /ubuntu-init-script.sh
source ~/.bashrc
cd ~/ocm-test-suite
npm run debug
`


It tests three flows:

### Public-link flow (login first)
In the public-link flow, the provider gives the consumer a public link, and the consumer clicks 'save to my personal cloud' on there.
In this flow, it is assumed that the consumer is already logged in to their personal cloud account before clicking 'save to my personal cloud' on the public link. After clicking, the consumer is redirected to their personal cloud account GUI, accepts the share, and then leaves it again.

### Public-link flow (login after)
Same as the previous flow, except the consumer is not logged in to their own personal cloud account yet when they get redirected to it
from the public link.

### Share-with flow
In this flow, the provider uses their own personal cloud account GUI to share a resource with the consumer, and the consumer notices this from the notification in their personal cloud acccount GUI, accepts the share, then leaves it again.

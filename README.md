# Test Suites for Personal Data Servers

## Introduction

The goal of these test suites is to test which open source
Personal Data Store implementations comply with which protocol specs.

## Info on what each test suite tests
There are 3 Solid-related test suites, which are now maintained at
[https://github.com/solid/test-suite](https://github.com/solid/test-suite).

This repo currently only contains the open-cloud-mesh test suite, which
will probably at some point move to [https://github.com/cs3org](https://github.com/cs3org),
but during the development phase, we host it here.

## Running testers against servers in a Docker testnet

To summarize the test results, we have opted to build them in Docker
and to run them within that. This documents how to run it:

Prerequisites: [Docker](https://docs.docker.com/install/)

Run the following commands in your command line terminal:

```sh
bash ./runOcmTests.sh
```

## Expected output

The final output should look something like:
```sh
[...]
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        6.315 s
Ran all test suites.
[...]
```

# To run a few servers in the testnet
While this is under development I'm running the tester from a mounted folder, so
make sure you have Node.js installed and run `npm install` in testers/open-cloud-mesh/tester.
Once it's stable I'll move that step back into testers/open-cloud-mesh/Dockerfile, where I
temporarily commented it out.

## ownCloud
```sh
./stopAndRemoveAll.sh
./startServer.sh owncloud-server
sleep 10
./runOcmTester.sh owncloud-server
```
## Nextcloud
```sh
./stopAndRemoveAll.sh
./startServer.sh nextcloud-server
sleep 10
docker exec -u www-data -it -e SERVER_ROOT=https://server server sh /init.sh
docker exec -u root -it server service apache2 reload
./runOcmTester.sh nextcloud-server
```
## Seafile
(coming soon)

# Manual testing
See https://github.com/michielbdejong/ocm-test-suite/issues/3
Add `127.0.0.1 host.docker.internal` to your /etc/hosts. Then:

```sh
./stopAndRemoveAll.sh
./manualTesting.sh
```

# Manual testing using pdsinterop.net

These instructions are mainly for myself (Michiel) to quickly start
the servers back up if I shut them down:

## Spin up servers and install Docker
* create oc1 / oc2 / nc1 / nc2 .pdsinterop.net on Digital Oceans
* edit *.psinterop.net DNS records on NameCheap
* ssh root@{o,n}c{1,2}.pdsinterop.net
* In ech, run (see https://docs.docker.com/engine/install/ubuntu/):
```sh
apt-get update
apt-get install -y apt-transport-https     ca-certificates     curl     gnupg-agent     software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io
docker run hello-world
git clone https://github.com/michielbdejong/ocm-test-suite
cd ocm-test-suite
git checkout ocm
```

## Start ownCloud
```sh
docker build -t owncloud-server servers/owncloud-server/
docker run -d -e SERVER_ROOT=https://`hostname`.pdsinterop.net -p 443:443 -p 80:80 --name=server owncloud-server
curl -kI https://`hostname`.pdsinterop.net
// ...?
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

# Test Suites for Personal Data Servers

## Introduction

The goal of these test suites is to test which open source
Personal Data Store implementations comply with which protocol specs.

## Info on what each test suite tests
So far, there is only one test suite here, namely [webid-provider](./docs/webid-provider.md).

## Running testers against servers in a Docker testnet

To summarize the test results, we have opted to build them in Docker
(this part was copied from [Solid's test-suite](https://github.com/solid/test-suite)),
and to run them within that. This documents how to run it:

Prerequisites: [Docker](https://docs.docker.com/install/)

Run the following commands in your command line terminal:

```sh
docker build -t webid-provider testers/webid-provider
docker build -t solid-crud testers/solid-crud
docker build -t open-cloud-mesh testers/open-cloud-mesh
docker network create testnet
mkdir  -p reports

bash runTests.sh node-solid-server
bash runTests.sh solid-app-kit
bash runTests.sh php-solid-server
bash runTests.sh nextcloud-server

grep Tests reports/*
```

## Expected output

Note that nextcloud-server and php-solid-server do not have webid-provider functionality enabled yet (we are
still working on that). Therefore, the final output should look something like:
```sh
reports/nextcloud-server-solid-crud.txt:Tests:       73 failed, 73 total
reports/nextcloud-server-webid-provider.txt:Tests:       14 skipped, 35 passed, 49 total
reports/node-solid-server-solid-crud.txt:Tests:       25 failed, 48 passed, 73 total
reports/node-solid-server-webid-provider.txt:Tests:       14 skipped, 35 passed, 49 total
reports/php-solid-server-solid-crud.txt:Tests:       73 failed, 73 total
reports/php-solid-server-webid-provider.txt:Tests:       11 failed, 14 skipped, 24 passed, 49 total
reports/solid-app-kit-solid-crud.txt:Tests:       73 failed, 73 total
reports/solid-app-kit-webid-provider.txt:Tests:       35 failed, 14 skipped, 49 total
```

To run one tester against one server interactively, you can do for instance:
```sh
./runTesterAgainstServer.sh webid-provider node-solid-server
[...]
root@f0c7e54fb1f3:/# npm run jest
root@f0c7e54fb1f3:/# exit
[...]
```

## Running one of the servers and one of the testers interactively:
In one terminal:
```sh
./runServer.sh node-solid-server
# DEBUG=* ./bin/solid-test start
```

In another terminal:
```sh
./runTester.sh webid-provider node-solid-server
# ./node_modules/.bin/jest test/surface/token.test.ts
```

## Running one of the testers
Running the tester Docker images on a Mac outside a testnet will not work
straight-forwardly due to https://docs.docker.com/docker-for-mac/networking/#use-cases-and-workarounds.

But to run for instance the webid-provider tester against a URL, you can simply run it outside Docker:
```sh
cd testers/webid-provider/tester
npm install
NODE_TLS_REJECT_UNAUTHORIZED=0 ALICE_WEBID=https://localhost/profile/card#me SERVER_ROOT=https://localhost ./node_modules/.bin/jest test/surface/*
```

## Running a server on https://localhost
```sh
docker run -d -p 443:443 nextcloud-server
```

## YMMV

Caveat 1: the qualities of a software product can of course not be counted with a simple number of passing tests,
so this list only gives a rough idea of levels of Solid spec compliance.

Caveat 2: not all servers may have been configured optimally in these test runs; if you know of ways to improve the
outcome for any of these servers, please provide a pull request.

Caveat 3: this test suite still incomplete and heavily biased towards LDP Basic container support.

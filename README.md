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
docker build -t open-cloud-mesh testers/open-cloud-mesh
docker network create testnet
mkdir  -p reports

bash runTests.sh nextcloud-server

grep Tests reports/*
```

## Expected output

The final output should look something like:
```sh
reports/nextcloud-server-open-cloud-mesh.txt:Tests:       1 passed, 1 total
```

To run one tester against one server interactively, you can do for instance:
```sh
./runTesterAgainstServer.sh open-cloud-mesh nextcloud-server
[...]
root@f0c7e54fb1f3:/# npm run jest
root@f0c7e54fb1f3:/# exit
[...]
```

## Running one of the servers and one of the testers interactively:
In one terminal:
```sh
./runServer.sh nextcloud-server
# DEBUG=* ./bin/solid-test start <- FIME: https://stackoverflow.com/questions/30441035/how-to-find-the-cmd-command-of-a-docker-image
```

In another terminal:
```sh
./runTester.sh open-cloud-mesh nextcloud-server
# ./node_modules/.bin/jest test/surface/token.test.ts
```

## Running one of the testers
Running the tester Docker images on a Mac outside a testnet will not work
straight-forwardly due to https://docs.docker.com/docker-for-mac/networking/#use-cases-and-workarounds.

But to run for instance the webid-provider tester against a URL, you can simply run it outside Docker:
```sh
cd testers/open-cloud-mesh/tester
npm install
NODE_TLS_REJECT_UNAUTHORIZED=0 SERVER_ROOT=https://localhost ./node_modules/.bin/jest
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

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

```sh
./startServer.sh owncloud-server
./runOcmTester.sh owncloud-server
./stopAndRemoveAll.sh
./startServer.sh nextcloud-server
docker exec -u www-data -it -e SERVER_ROOT=https://server server sh /init.sh
docker exec -u root -it server service apache2 reload
./runOcmTester.sh nextcloud-server
```
# Test Suites for Personal Data Servers

## Introduction

The goal of these test suites is to test which open source
Personal Data Store implementations comply with which protocol specs.

## Test Suite Summary in Docker

To summarize the test results, we have opted to build them in Docker
(this part was copied from [Solid's test-suite](https://github.com/solid/test-suite)),
and to run them within that. This documents how to run it:

Prerequisites: [Docker](https://docs.docker.com/install/)

Run the following commands in your command line terminal:

```sh
docker build -t webid-provider testers/webid-provider
docker network create testnet
mkdir  -p reports

bash runTests.sh node-solid-server
bash runTests.sh solid-app-kit

grep Tests reports/*
```
The final output should look something like:
```sh
reports/node-solid-server-webid-provider.txt:Tests:       1 failed, 4 skipped, 25 passed, 30 total
reports/solid-app-kit-webid-provider.txt:Tests:       11 failed, 4 skipped, 15 passed, 30 total
```

To run one tester against one server interactively, you can do for instance:
```sh
./runTesterAgainstServer.sh webid-provider node-solid-server
[...]
root@f0c7e54fb1f3:/# npm run jest
root@f0c7e54fb1f3:/# exit
[...]
```

Caveat 1: the qualities of a software product can of course not be counted with a simple number of passing tests,
so this list only gives a rough idea of levels of Solid spec compliance.

Caveat 2: not all servers may have been configured optimally in these test runs; if you know of ways to improve the
outcome for any of these servers, please provide a pull request.

Caveat 3: this test suite still incomplete and heavily biased towards LDP Basic container support.

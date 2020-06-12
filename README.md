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
docker build -t ldp-basic testers/ldp-basic
docker build -t websockets-pubsub testers/websockets-pubsub
docker build -t rdf-fixtures testers/rdf-fixtures

docker build -t table-reporter reporters/table
docker network create testnet
mkdir  -p reports

bash runTests.sh node-solid-server
bash runTests.sh trellis
bash runTests.sh wac-ldp

egrep 'Tests:|tests run:|earl:outcome' reports/* | docker run -i table-reporter
```
The final output should look something like:
```sh
Server              	LDP Basic           	Websockets-pub-sub  	RDF-fixtures
node-solid-server   	15/90               	0/1                 	22/49
trellis             	47/90               	0/1                 	10/45
wac-ldp             	57/90               	1/1                 	8/50
```

To run one tester against one server interactively, you can do for instance:
```sh
./runTesterAgainstServer.sh rdf-fixtures node-solid-server
[...]
root@f0c7e54fb1f3:/# prove --formatter TAP::Formatter::EARL -l /opt/run-scripts/
root@f0c7e54fb1f3:/# exit
[...]
```

or:

```sh
./runTesterAgainstServer.sh ldp-basic node-solid-server
[...]
root@f0c7e54fb1f3:/# java -jar ldp-testsuite.jar --basic --server http://server:8080 --test PostContainer
root@f0c7e54fb1f3:/# exit
[...]
```

Caveat 1: the qualities of a software product can of course not be counted with a simple number of passing tests,
so this list only gives a rough idea of levels of Solid spec compliance.

Caveat 2: not all servers may have been configured optimally in these test runs; if you know of ways to improve the
outcome for any of these servers, please provide a pull request.

Caveat 3: this test suite still incomplete and heavily biased towards LDP Basic container support.
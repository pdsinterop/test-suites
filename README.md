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
reports/nextcloud-server-open-cloud-mesh.txt:Tests:       1 failed, 1 total
reports/nextcloud-server-solid-crud.txt:Tests:       0 total
reports/nextcloud-server-webid-provider.txt:Tests:       43 failed, 6 skipped, 49 total
reports/node-solid-server-open-cloud-mesh.txt:Tests:       1 failed, 1 total
reports/node-solid-server-solid-crud.txt:Tests:       0 total
reports/node-solid-server-webid-provider.txt:Tests:       41 failed, 6 skipped, 2 passed, 49 total
reports/php-solid-server-open-cloud-mesh.txt:Tests:       1 failed, 1 total
reports/php-solid-server-solid-crud.txt:Tests:       0 total
reports/php-solid-server-webid-provider.txt:Tests:       43 failed, 6 skipped, 49 total
reports/solid-app-kit-open-cloud-mesh.txt:Tests:       1 failed, 1 total
reports/solid-app-kit-solid-crud.txt:Tests:       0 total
reports/solid-app-kit-webid-provider.txt:Tests:       43 failed, 6 skipped, 49 total
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

## Running with manually harvested cookie

This is what we're using due to https://github.com/pdsinterop/test-suites/issues/22:
* Stop and remove all running docker containers (make sure you don't have any unrelated ones running!):
```sh
docker stop `docker ps -q`
docker rm `docker ps -aq`
```
* Build and start the nextcloud server:
```sh
docker build -t nextcloud-server ./servers/nextcloud-server --no-cache
docker run -p 443:443 -d --rm --name=server nextcloud-server
echo sleeping
sleep 10
echo slept
docker logs server
docker exec -u www-data -it server sh /init.sh
docker exec -u root -it server service apache2 reload
```
* Now visit https://localhost (make sure to accept the self-signed cert, instructions for that differ per browser)
* Open the developer tools, on the network tab tick 'Preserve log' and clear the network log
* Log in as alice / alice123
* find the second request (to `files/`), Ctrl-click `login` -> Copy -> Copy Request Headers
* The result should look something like:
```
GET /apps/files/ HTTP/1.1
Host: localhost
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,de-DE;q=0.4,de;q=0.3,es-ES;q=0.2,es;q=0.1,id-ID;q=0.1,id;q=0.1
Cookie: oc_sessionPassphrase=pEDYZTQ1Kd4nVRXMyZaoskpFun37qNfTTTRJt0memMA4nvBS%2BQf8Q0ji5hObY4QEgPWzG2%2FT0GRLzaJxKZk5PyMvf7Z3tzJgd8Keylb6VGZq4bF73onkRnL7oU7%2FmI2m; __Host-nc_sameSiteCookielax=true; __Host-nc_sameSiteCookiestrict=true; oc99o50ta95q=e600921145a4fe9ddba10bd41a05da3b; nc_username=alice; ocwz72epe95s=a5555f9fcd266fa6347c436480d330c5; nc_token=JWcwkjRt0RexKf7QULFMmjBFaBlYIZvW; nc_session_id=a5555f9fcd266fa6347c436480d330c5
```
From there, copy the part after `Cookie:` and set it as the COOKIE environment variable, for instance:
```sh
export COOKIE="oc_sessionPassphrase=pEDYZTQ1Kd4nVRXMyZaoskpFun37qNfTTTRJt0memMA4nvBS%2BQf8Q0ji5hObY4QEgPWzG2%2FT0GRLzaJxKZk5PyMvf7Z3tzJgd8Keylb6VGZq4bF73onkRnL7oU7%2FmI2m; __Host-nc_sameSiteCookielax=true; __Host-nc_sameSiteCookiestrict=true; oc99o50ta95q=e600921145a4fe9ddba10bd41a05da3b; nc_username=alice; ocwz72epe95s=a5555f9fcd266fa6347c436480d330c5; nc_token=JWcwkjRt0RexKf7QULFMmjBFaBlYIZvW; nc_session_id=a5555f9fcd266fa6347c436480d330c5"
echo Cookie set:
echo $COOKIE
```
Make sure it contains `nc_username` and `nc_token`.
And here it gets tricky because you would want to run something like:
```sh
docker run -e COOKIE="$COOKIE" -e SERVER_ROOT="https://host.docker.internal" -e ALICE_WEBID="https://host.docker.internal/apps/solid/@alice/turtle#me" webid-provider
```
But then you'll run into https://github.com/pdsinterop/test-suites/issues/26.
So at this point you could also just follow the instructions from https://github.com/solid/webid-provider-tests#against-production and just run that test suite against https://localhost/ on your host machine, instead of doing it inside the testnet.


## YMMV

Caveat 1: the qualities of a software product can of course not be counted with a simple number of passing tests,
so this list only gives a rough idea of levels of Solid spec compliance.

Caveat 2: not all servers may have been configured optimally in these test runs; if you know of ways to improve the
outcome for any of these servers, please provide a pull request.

Caveat 3: this test suite still incomplete and heavily biased towards LDP Basic container support.

#!/bin/bash
set -e

function setup {
  docker network create testnet
  docker build -t nextcloud-server servers/nextcloud-server/
  docker pull michielbdejong/nextcloud-cookie
  docker build -t open-cloud-mesh testers/open-cloud-mesh
}
function teardown {
  docker stop `docker ps --filter network=testnet -q`
  docker rm `docker ps --filter network=testnet -qa`
  docker network remove testnet
}

function startSolidNextcloud {
  docker run -d --name $1 --network=testnet --env-file ./env-vars-$1.list nextcloud-server
  until docker run --rm --network=testnet open-cloud-mesh curl -kI https://$1 2> /dev/null > /dev/null
  do
    echo Waiting for $1 to start, this can take up to a minute ...
    docker ps -a
    docker logs $1
    sleep 1
  done

  docker logs $1
  echo Running init script for Nextcloud $1 ...
  docker exec -u www-data -it -e SERVER_ROOT=https://$1 $1 sh /init.sh
  docker exec -u root -it $1 service apache2 reload
  echo Getting cookie for $1...
  export COOKIE_$1="`docker run --cap-add=SYS_ADMIN --network=testnet --env-file ./env-vars-$1.list michielbdejong/nextcloud-cookie`"
}

function runTests {
  echo "Running $1 tests against server with cookie $COOKIE_server"
  docker run --rm --network=testnet \
    --env COOKIE="$COOKIE_server" \
    --env COOKIE_ALICE="$COOKIE_server" \
    --env COOKIE_BOB="$COOKIE_thirdparty" \
    --env-file ./env-vars-testers.list $1
}

# ...
teardown || true
setup
startSolidNextcloud server
runTests open-cloud-mesh
teardown

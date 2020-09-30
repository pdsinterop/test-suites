echo Running tester $1 against server $2 ...
echo Building tester and server images ...
docker build -t $1 testers/$1
docker build -t $2-base servers/$2/base
docker build -t $2 servers/$2/server
docker build -t $2-cookie servers/$2/cookie

echo Deleting stopped servers from previous run:
docker rm server
docker rm cookie
docker rm tester

echo Starting server...
docker run -d --name=server --network=testnet $2
echo Waiting for server to start ...
sleep 2
docker logs server
if [[ "$2" == nextcloud-server ]]
  then
    sleep 10
    docker logs server
    echo Running init script for Nextcloud server ...
    docker exec -u www-data -it -e SERVER_ROOT=https://server server sh /init.sh
    docker exec -u root -it server service apache2 reload
fi

echo Getting cookie...
export COOKIE="`docker run --cap-add=SYS_ADMIN --network=testnet --name cookie --env-file servers/$2/env.list $2-cookie`"

echo Running $1 tester interactively with cookie $COOKIE...
docker run --network=testnet --name tester --env COOKIE="$COOKIE" --env-file servers/$2/env.list -it $1 /bin/bash

echo Tester exited, stopping server ...
docker stop server

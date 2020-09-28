echo Testing $1...
echo Building images...
docker build -t $1-base servers/$1/base
docker build -t $1 servers/$1/server
docker build -t $1-cookie servers/$1/cookie

echo Deleting stopped servers from previous run:
docker rm server
docker rm cookie
docker rm tester

echo Starting server...
docker run -d --name=server --network=testnet $1
echo Waiting for server to start ...
sleep 2
docker logs server
if [[ "$1" == nextcloud-server ]]
  then
    sleep 10
    docker logs server
    echo Running init script for Nextcloud server ...
    docker exec -u www-data -it server sh /init.sh
    docker exec -u root -it server service apache2 reload
fi

echo Getting cookie...
export COOKIE="`docker run --cap-add=SYS_ADMIN --network=testnet --name cookie --env-file servers/$1/env.list $1-cookie`"

echo Running webid-provider tester with cookie $COOKIE...
docker run --network=testnet --name tester --env COOKIE="$COOKIE" --env-file servers/$1/env.list webid-provider 2> reports/$1-webid-provider.txt

# echo Running solid-crud tester...
# docker run --network=testnet --env-file servers/$1/env.list solid-crud 2> reports/$1-solid-crud.txt
# 
# echo Running open-cloud-mesh tester...
# docker run --network=testnet --env-file servers/$1/env.list open-cloud-mesh 2> reports/$1-open-cloud-mesh.txt

echo Stopping server...
docker stop server

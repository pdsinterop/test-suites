echo Running tester, assuming server $1 is up on the testnet ...
echo Building tester image...
docker build -t open-cloud-mesh testers/open-cloud-mesh

# until docker run --rm --network=testnet --env-file servers/$1/env.list open-cloud-mesh curl -kI \$SERVER_ROOT 2> /dev/null > /dev/null
# do
#   echo Waiting for $1 to start, this can take up to a minute ...
#   docker ps -a
#   docker logs server
#   sleep 1
# done

echo Starting tester ...
docker run --rm --network=testnet --env-file servers/$1/env.list open-cloud-mesh
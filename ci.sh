#!/bin/bash
docker rm `docker ps -aq`
docker network remove testnet
docker network create testnet
docker run -d --network=testnet --rm --name=oc1.docker oc1
docker run -d --network=testnet --rm --name=oc2.docker oc2
docker run -d --network=testnet --rm --name=nc1.docker nc1
docker run -d --network=testnet --rm --name=nc2.docker nc2
docker run -d --network=testnet --rm --name=stub1.docker -e HOST=stub1 stub
docker run -d --network=testnet --rm --name=stub2.docker -e HOST=stub2 stub
docker run -d --network=testnet --rm --name=revad1.docker -e HOST=revad1 revad
docker run -d --network=testnet --rm --name=revad2.docker -e HOST=revad2 revad
docker run -d --network=testnet --name=tester --cap-add=SYS_ADMIN tester
docker exec tester /bin/bash /ubuntu-init-script.sh
docker exec tester /bin/bash /ubuntu-ci-script.sh

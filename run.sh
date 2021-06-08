#!/bin/bash
docker rm `docker ps -aq`
docker network remove testnet
docker network create testnet
docker run -d --network=testnet --name=revad revad
docker run -d --network=testnet --cap-add=SYS_ADMIN --name=tester tester

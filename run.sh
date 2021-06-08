#!/bin/bash
docker rm `docker ps -aq`
docker network remove testnet
# git clone https://github.com/cs3org/reva
# cd reva
# git checkout 56c89e07cf0c68d 
# docker build -t revadbase -f ./Dockerfile.revad .
# cd ..
# docker build -t tester .
# cd revad
# docker build -t revad .
# cd ..
docker network create testnet
docker run -d --network=testnet --name=revad revad
docker run -d --network=testnet --cap-add=SYS_ADMIN --name=tester tester

#!/bin/bash
git clone https://github.com/cs3org/reva
cd reva
git checkout 56c89e07cf0c68d 
docker build -t revadbase -f ./Dockerfile.revad .
cd ..
rm -rf reva
docker build -t tester .
cd revad
docker build -t revad .
cd ../servers/nextcloud-server
docker build -t nextcloud .
cd ../owncloud-server
docker-compose pull

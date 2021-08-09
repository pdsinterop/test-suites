#!/bin/bash
docker build -t tester .

# git clone https://github.com/michielbdejong/ocm-stub
cd ocm-stub
docker build -t stub .
cd ..
# rm -rf ocm-stub

# git clone https://github.com/michielbdejong/reva
cd reva
# git checkout pass-ocm-test-suite
docker build -t revadbase -f ./Dockerfile.revad .
cd ..
# rm -rf reva
cd revad
docker build -t revad .

cd ../servers/nextcloud-server
docker build -t nextcloud .
# cd ../owncloud-server
# docker-compose pull

#!/bin/bash
docker build -t tester .
# cd ocm-stub
# docker build -t stub .
# cd ..
cd servers/revad
docker build -t revad .
cd ../apache-php-7.4
docker build -t apache-php-7.4 .
cd ../apache-php-8.0
docker build -t apache-php-8.0 .
cd ../nextcloud
docker build -t nextcloud .
cd ../nc1
docker build -t nc1 .
cd ../nc2
docker build -t nc2 .
# cd ../owncloud
# docker build -t owncloud .
# cd ../oc1
# docker build -t oc1 .
# cd ../oc2
# docker build -t oc2 .

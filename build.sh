#!/bin/bash
docker build -t tester .
# cd ocm-stub
# docker build -t stub .
# cd ..
cd servers/revad
docker build -t revad .
cd ../apache-php
docker build -t apache-php .
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

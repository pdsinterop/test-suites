#!/bin/bash
set -e

export DOCKER_BUILDKIT=0

# base image for nextcloud image:
cd servers/apache-php-8.0
cp -r ../../tls .
docker build -t apache-php-8.0 .

# base image for nc1 image and nc2 image:
cd ../nextcloud
# docker build -t nextcloud --build-arg CACHEBUST=`date +%s` .
docker build -t nextcloud .

# image for nc1:
cd ../nc1
docker build -t nc1 .

# image for nc2:
cd ../nc2
docker build -t nc2 .

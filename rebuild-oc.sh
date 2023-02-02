#!/bin/bash
set -e

export DOCKER_BUILDKIT=0

# base image for owncloud image:
cd servers/apache-php-7.4
cp -r ../../tls .
docker build -t apache-php-7.4 .

# base image for oc1 image and oc2 image:
cd ../owncloud
docker build -t owncloud .

# image for oc1:
cd ../oc1
docker build -t oc1 .

# image for oc2:
cd ../oc2
docker build -t oc2 .

#!/bin/bash
set -e
apt-get update
apt-get install -yq docker.io
docker ps

git clone https://github.com/sciencemesh/nc-sciencemesh
git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout revanc

/bin/bash ./rebuild.sh
/bin/bash ./debug.sh

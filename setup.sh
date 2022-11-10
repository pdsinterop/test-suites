#!/bin/bash
set -e
apt-get update
apt-get install -yq docker.io
docker ps
git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout main
./gitpod-init.sh
/bin/bash ./debug.sh

# There are really three ways to add a tester to the testnet,
# see debug.sh for more details.

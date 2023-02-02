#!/bin/bash

set -e

git clone --branch=main https://github.com/pondersource/nc-sciencemesh
git clone --branch=main https://github.com/pondersource/oc-sciencemesh
git clone --branch=efss-backend-fixes https://github.com/cs3org/reva
git clone --branch=main https://github.com/michielbdejong/ocm-stub

/bin/bash ./gencerts.sh
/bin/bash ./rebuild.sh

docker pull jlesage/firefox:v1.17.1
docker pull mariadb:latest
#!/bin/bash
set -e
REPO_PATH=`pwd`

# git clone --depth=1 --branch=dev https://github.com/sciencemesh/nc-sciencemesh
# git clone --depth=1 --branch=dev https://github.com/pondersource/oc-sciencemesh
# git clone --depth=1 --branch=efss-backend-fixes https://github.com/cs3org/reva
# git clone --depth=1 --branch=main https://github.com/michielbdejong/ocm-stub

# /bin/bash ./gencerts.sh
/bin/bash ./rebuild.sh
docker run -v $REPO_PATH/ocm-stub:/ocm-stub stub npm install
docker run -v $REPO_PATH/reva:/reva \
  -e"PATH=/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  --workdir /reva revad bash -c "git config --global --add safe.directory /reva && make build-revad && make build-reva"
docker run -v $REPO_PATH/nc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh nc1 make composer
docker run -v $REPO_PATH/oc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh oc1 make composer
docker pull jlesage/firefox
docker pull mariadb:latest
#!/bin/bash

set -e

REPO_ROOT=`pwd`

docker run -v $REPO_ROOT/ocm-stub:/ocm-stub stub npm install
docker run -v $REPO_ROOT/reva:/reva \
  -e"PATH=/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  --workdir /reva revad bash -c "git config --global --add safe.directory /reva && make build-revad && make build-reva"
docker run -v $REPO_ROOT/nc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh nc1 make composer
docker run -v $REPO_ROOT/oc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh oc1 make composer

cd nc-sciencemesh
git pull
cd ..
cd oc-sciencemesh
git pull
cd ..
cd ocm-stub
git pull
cd ..
cd reva
git pull
cd ..

./scripts/clean.sh
echo to see the Firefox tester, open `gp url 5800` with your browser
./scripts/orro-testing.sh
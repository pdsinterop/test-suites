#!/bin/bash
set -e

git clone --depth=1 --branch=dev https://github.com/sciencemesh/nc-sciencemesh
git clone --depth=1 --branch=dev https://github.com/pondersource/oc-sciencemesh
git clone --depth=1 --branch=ocmd-error-messages-backport https://github.com/cs3org/reva
git clone --depth=1 --branch=main https://github.com/michielbdejong/ocm-stub

/bin/bash ./gencerts.sh
/bin/bash ./rebuild.sh
docker run -v /workspace/ocm-test-suite/ocm-stub:/ocm-stub stub npm install
docker run -v /workspace/ocm-test-suite/reva:/reva \
  -e"PATH=/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  --workdir /reva revad bash -c "git config --global --add safe.directory /reva && make build-revad && make build-reva"
docker run -v /workspace/ocm-test-suite/nc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh nc1 make composer
docker run -v /workspace/ocm-test-suite/oc-sciencemesh:/var/www/html/apps/sciencemesh --workdir /var/www/html/apps/sciencemesh oc1 make composer
docker pull jlesage/firefox
docker pull mariadb:latest
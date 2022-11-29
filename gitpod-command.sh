#!/bin/bash
set -e

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
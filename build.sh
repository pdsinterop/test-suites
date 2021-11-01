#!/bin/bash
mkdir -p tls
function createCert {
  openssl req -new -x509 -days 365 -nodes \
    -out ./tls/$1.crt \
    -keyout ./tls/$1.key \
    -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=$1" \
    -addext "subjectAltName = DNS:$1.docker"
}

createCert nc1
createCert nc2
createCert oc1
createCert oc2
createCert stub1
createCert stub2
createCert revad1
createCert revad2

docker build -t tester .

git clone https://github.com/michielbdejong/ocm-stub
cd ocm-stub
cp -r ../tls .
docker build -t stub .
cd ..

cd servers/revad
cp -r ../../tls .
docker build -t revad .

cd ../apache-php
cp -r ../../tls .
docker build -t apache-php .

cd ../nextcloud
docker build -t nextcloud .

cd ../nc1
docker build -t nc1 .

cd ../nc2
docker build -t nc2 .

cd ../owncloud
docker build -t owncloud .

cd ../oc1
docker build -t oc1 .

cd ../oc2
docker build -t oc2 .

cd ../ci
docker build -t ci .

#!/bin/bash
mkdir -p tls
function createCert {
  echo Generating key and CSR for $1.docker
  openssl req -new -days 365 -nodes \
    -out ./tls/$1.csr \
    -keyout ./tls/$1.key \
    -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=$1" \
    -addext "subjectAltName = DNS:$1.docker"
  echo Signing CSR for $1.docker, creating cert.
  openssl x509 -req -in ./tls/$1.csr -CA ./tls/ocm-ca.crt -CAkey ./tls/ocm-ca.key -CAcreateserial -out ./tls/$1.crt
}

echo Generating CA key
openssl genrsa -out ./tls/ocm-ca.key 2058
echo Generate CA self-signed certificate
openssl req -new -x509 -days 365 \
    -key ./tls/ocm-ca.key \
    -out ./tls/ocm-ca.crt \
    -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=$1"

createCert nc1
createCert nc2
createCert oc1
createCert oc2
createCert stub1
createCert stub2
createCert revad1
createCert revad2
createCert revanc1
createCert revanc2

docker build -t tester .

# image for stub1 and stub2:
git clone https://github.com/michielbdejong/ocm-stub
cd ocm-stub
cp -r ../tls .
docker build -t stub .
cd ..

# image for revad1, revad2, revanc1, revanc2:
cd servers/revad
cp -r ../../tls .
# docker build -t revad --build-arg CACHEBUST=`date +%s` .
docker build -t revad .

# base image for nextcloud image and owncloud image:
cd ../apache-php
cp -r ../../tls .
docker build -t apache-php .

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

# base image for oc1 image and oc2 image:
cd ../owncloud
docker build -t owncloud .

# image for oc1:
cd ../oc1
docker build -t oc1 .

# image for oc2:
cd ../oc2
docker build -t oc2 .

#  cd ../ci
#  cp -r ../../tls .
#  docker build -t ci .

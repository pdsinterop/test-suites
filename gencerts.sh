#!/bin/bash
set -e

mkdir -p tls
function createCert {
  echo Generating key and CSR for $1.docker
  openssl req -new -days 365 -nodes \
    -out ./tls/$1.csr \
    -keyout ./tls/$1.key \
    -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=$1.docker" \
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
    -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=ocm-ca"

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

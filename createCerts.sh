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

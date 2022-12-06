#!/bin/bash
set -e

# First, fill in these two variables:
export EFSS=cloud.pondersource.org
export REVA=mesh.pondersource.org

echo Please edit this file and run the commands one-by-one so you can check if it all works
exit 0

apt install -y certbot docker.io
certbot certonly --standalone
git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
./gitpod-init.sh
docker run -d --network=host --name=revanc1.docker -e HOST=$REVA revad sleep 1000000000
docker container cp /etc/letsencrypt/archive/$REVA/fullchain1.pem revanc1.docker:/etc/revad/tls/revanc1.crt
docker container cp /etc/letsencrypt/archive/$REVA/privkey1.pem revanc1.docker:/etc/revad/tls/revanc1.key
docker exec -it revanc1.docker openssl x509 -in tls/revanc1.crt -text
docker exec -it revanc1.docker bash
# vim revanc1.toml and providers.testnet.toml
# :%s/revanc1.docker/mesh.pondersource.org/g
# :%s/nc1.docker/cloud.pondersource.org/g
# :wq
# /reva/cmd/revad/revad -c ./revanc1.toml

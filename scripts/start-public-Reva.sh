#!/bin/bash
set -e

# First, fill in these two variables:
export EFSS=cloud.pondersource.org
export REVA=mesh.pondersource.org

# Now, make sure you have run:
# apt install -y certbot
# certbot certonly --standalone
# cd servers/revad
# mkdir tls
# cp /etc/letsencrypt/live/$REVA/fullchain.pem tls/revanc1.crt
# cp /etc/letsencrypt/live/$REVA/privkey.pem tls/revanc1.key
# openssl x509 -in tls/revanc1.crt -text
# cd ../..
# ./rebuild.sh
docker run -d --network=host --name=revanc1.docker -e HOST=$REVA revad sleep 1000000000
docker container cp /etc/letsencrypt/archive/$REVA/fullchain1.pem revanc1.docker:/etc/revad/tls/revad1.crt
docker container cp /etc/letsencrypt/archive/$REVA/privkey1.pem revanc1.docker:/etc/revad/tls/revad1.key
docker exec -it revanc1.docker bash
# vim revanc1.toml and providers.testnet.toml
# :%s/revanc1.docker/mesh.pondersource.org/g
# :%s/nc1.docker/cloud.pondersource.org/g
# :wq
# /reva/cmd/revad/revad -c ./revanc1.toml

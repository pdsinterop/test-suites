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
mkdir -p config/tls
cp  /etc/letsencrypt/archive/$REVA/fullchain1.pem config/tls/revanc1.crt
cp /etc/letsencrypt/archive/$REVA/privkey1.pem config/tls/revanc1.key
openssl x509 -in config/tls/revanc1.crt -text | head -15
cp servers/revad/sciencemesh.toml config/$REVA.toml
vim config/$REVA.toml
# :%s/your.revad.com/mesh.pondersource.org/g
# expect 25 substitutions on 25 lines
# :%s/your.efss.com/cloud.pondersource.org/g
# expect 7 substitutions on 7 lines
# :wq

# See https://developer.sciencemesh.io/docs/technical-documentation/iop/configuration/basic/
# for full docs about creating your config/$REVA.toml file

docker run -d --network=host --name=revanc1.docker -e HOST=$REVA -v `pwd`/reva:/reva -v `pwd`/config:/etc/revad revad

docker ps -a
docker logs revanc1.docker
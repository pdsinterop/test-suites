#!/bin/bash
set -e

# First, fill in these two variables:
export EFSS=cloud.pondersource.org
export REVA=mesh.pondersource.org

# Now, make sure you have run:
# apt install -y certbot
# certbot certonly --standalone
# cd servers/apache-php
# mkdir tls
# cp /etc/letsencrypt/live/$REVA/fullchain.pem tls/nc1.crt
# cp /etc/letsencrypt/live/$REVA/privkey.pem tls/nc1.key
# cd ../..
# ./rebuild.sh
docker run -d --network=host --name=revad1.docker -e HOST=r$REVA revad

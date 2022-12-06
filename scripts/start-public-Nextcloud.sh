#!/bin/bash
set -e

export EFSS=cloud.pondersource.org
export REVA=mesh.pondersource.org

## First, if your Nextcloud server is for instance cloud.pondersource.org, make sure you have run:
# apt install -y certbot
# certbot certonly --standalone
# cd servers/apache-php
# mkdir tls
# cp /etc/letsencrypt/live/$EFSS/fullchain.pem tls/nc1.crt
# cp /etc/letsencrypt/live/$EFSS/privkey.pem tls/nc1.key
# cd ../..
# ./rebuild.sh

export REPO_ROOT=`pwd`
[ ! -d "./scripts" ] && echo "Directory ./scripts DOES NOT exist inside $REPO_ROOT, are you running this from the repo root?" && exit 1

function waitForPort {
  x=$(docker exec -it $1 ss -tulpn | grep $2 | wc -l)
  until [ $x -ne 0 ]
  do
    echo Waiting for $1 to open port $2, this usually takes about 10 seconds ... $x
    sleep 1
    x=$(docker exec -it $1 ss -tulpn | grep $2 | wc -l)
  done
  echo $1 port $2 is open
}

docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet -p 443:443 -e HOST=$EFSS --name=nc1.docker nc1

waitForPort maria1.docker 3306
waitForPort nc1.docker 443

docker exec -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity  -u www-data nc1.docker sh /init.sh
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'iopUrl', 'https://$REVA/');"
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'revaSharedSecret', 'shared-secret-1');"

#!/bin/bash
set -e
docker run -d --network=testnet --name=revanc1.docker -v /workspace/ocm-test-suite/reva:/reva -e HOST=revanc1 revad sleep 30000
docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet --name=nc1.docker -v /workspace/ocm-test-suite/nc-sciencemesh:/var/www/html/apps/sciencemesh nc1

sleep 15
docker exec -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity  -u www-data nc1.docker sh /init.sh
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'iopUrl', 'https://revanc1.docker/');"
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'revaSharedSecret', 'shared-secret-1');"
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'meshDirectoryUrl', 'https://meshdir.docker/meshdir');"

echo docker exec revanc1.docker /bin/bash
echo echo \"127.0.0.1 \$HOST.docker\" \>\> /etc/hosts
echo export PATH=\$PATH:/usr/local/go/bin
echo cd /reva \; make build-revad \; cd /etc/revad \; /reva/cmd/revad/revad -c /etc/revad/\$HOST.toml

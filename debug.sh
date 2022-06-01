#!/bin/bash
docker kill `docker ps -q`
docker rm `docker ps -aq`
docker network remove testnet
docker network create testnet

# stub:
docker run -d --network=testnet --name=stub1.docker stub
docker run -d --network=testnet --name=stub2.docker stub

# reva:
docker run -d --network=testnet --name=revad1.docker -e HOST=revad1 revad
docker run -d --network=testnet --name=revad2.docker -e HOST=revad2 revad

# revanc (combine with nc!):
# docker run -d --network=testnet --name=revanc1.docker -e HOST=revanc1 revad
# docker run -d --network=testnet --name=revanc2.docker -e HOST=revanc2 revad

# nc:
docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet --name=nc1.docker -v /root/nc-sciencemesh:/var/www/html/apps/sciencemesh nc1
docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria2.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet --name=nc2.docker -v /root/nc-sciencemesh:/var/www/html/apps/sciencemesh nc2

sleep 10
docker exec -it -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity  -u www-data nc1.docker sh /init.sh
docker exec -it maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'iopUrl', 'https://revanc1.docker/');"
docker exec -it maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'revaSharedSecret', 'shared-secret-1');"

docker exec -it -e DBHOST=maria2.docker -e USER=marie -e PASS=radioactivity -u www-data nc2.docker sh /init.sh
docker exec -it maria2.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'iopUrl', 'https://revanc2.docker/');"
docker exec -it maria2.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek nextcloud -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'revaSharedSecret', 'shared-secret-2');"

# oc:
docker run -d --network=testnet --name=oc1.docker oc1
docker run -d --network=testnet --name=oc2.docker oc2

# There are really three ways to add a tester to the testnet:
# 1. The way https://github.com/cs3org/ocm-test-suite/blob/main/.github/workflows/ci.yml and
#    https://github.com/cs3org/ocm-test-suite/blob/main/scripts/run-test.sh do it:

# docker run --network=testnet --name=tester.docker -e FLOW="$1" -e FROM_SERVER="$2" -e TO_SERVER="$3" ci

# 2. Using a Firefox-in-a-box:

# ./scripts/start-firefox-in-a-box.sh
# echo Now browse to http://ocmhost:5800 to see a Firefox instance that sits inside the Docker testnet.
# echo docker exec -it revanc1.docker /bin/bash
# echo docker exec -it revanc2.docker /bin/bash
# echo echo \"127.0.0.1 \$HOST.docker\" \>\> /etc/hosts
# echo export PATH=\$PATH:/usr/local/go/bin
# echo cd /reva \; make build-revad \; cd /etc/revad \; /reva/cmd/revad/revad -c /etc/revad/\$HOST.toml

# 3. Using vnc:

# docker build -t tester .
# docker run -p 6080:80 -p 5900:5900 -v /dev/shm:/dev/shm --network=testnet --name=tester -d --cap-add=SYS_ADMIN tester
# TESTER_IP_ADDR=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tester`
# echo $TESTER_IP_ADDR
# # set up port forwarding from host to testnet for vnc:
# sysctl net.ipv4.ip_forward=1
# iptables -t nat -A PREROUTING -p tcp --dport 5900 -j DNAT --to-destination $TESTER_IP_ADDR:5900


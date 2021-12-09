#!/bin/bash
docker rm `docker ps -aq`
docker network remove testnet
docker network create testnet

#docker run -d --network=testnet --name=oc1.docker oc1
#docker run -d --network=testnet --name=oc2.docker oc2

docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=1234 --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet --name=nc1.docker nc1
docker exec -it -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity -u www-data nc1.docker sh /init.sh

docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=1234 --name=maria2.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet --name=nc2.docker nc2
docker exec -it -e DBHOST=maria2.docker -e USER=marie -e PASS=radioactivity -u www-data nc2.docker sh /init.sh

#docker run -d --network=testnet --name=stub1.docker -e HOST=stub1 stub
#docker run -d --network=testnet --name=stub2.docker -e HOST=stub2 stub
#docker run -d --network=testnet --name=revad1.docker -e HOST=revad1 revad
#docker run -d --network=testnet --name=revad2.docker -e HOST=revad2 revad
docker run -d --network=testnet --name=revanc1.docker -e HOST=revanc1 revad
docker run -d --network=testnet --name=revanc2.docker -e HOST=revanc2 revad
docker run -p 6080:80 -p 5900:5900 -v /dev/shm:/dev/shm --network=testnet --name=tester -d --cap-add=SYS_ADMIN tester

TESTER_IP_ADDR=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tester`
echo $TESTER_IP_ADDR
# set up port forwarding from host to testnet for vnc:
sysctl net.ipv4.ip_forward=1
iptables -t nat -A PREROUTING -p tcp --dport 5900 -j DNAT --to-destination $TESTER_IP_ADDR:5900

#!/bin/bash
docker rm `docker ps -aq`
docker network remove testnet
docker network create testnet

#docker run -d --network=testnet --rm --name=oc1.docker oc1
#docker run -d --network=testnet --rm --name=oc2.docker oc2
docker run -d --network=testnet --rm --name=nc1.docker nc1
docker run -d --network=testnet --rm --name=nc2.docker nc2
#docker run -d --network=testnet --rm --name=stub1.docker -e HOST=stub1 stub
#docker run -d --network=testnet --rm --name=stub2.docker -e HOST=stub2 stub
#docker run -d --network=testnet --rm --name=revad1.docker -e HOST=revad1 revad
#docker run -d --network=testnet --rm --name=revad2.docker -e HOST=revad2 revad
docker run -d --network=testnet --rm --name=revanc1.docker -e HOST=revanc1 revad
docker run -d --network=testnet --rm --name=revanc2.docker -e HOST=revanc2 revad
docker run -p 6080:80 -p 5900:5900 -v /dev/shm:/dev/shm --network=testnet --name=tester -d --cap-add=SYS_ADMIN tester

TESTER_IP_ADDR=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tester`
echo $TESTER_IP_ADDR
# set up port forwarding from host to testnet for vnc:
sysctl net.ipv4.ip_forward=1
iptables -t nat -A PREROUTING -p tcp --dport 5900 -j DNAT --to-destination $TESTER_IP_ADDR:5900

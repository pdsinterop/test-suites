#!/bin/bash
set -e
apt-get update
apt-get install -yq docker.io
docker ps

git clone https://github.com/sciencemesh/nc-sciencemesh
git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout dev

/bin/bash ./gencerts.sh
/bin/bash ./rebuild.sh
/bin/bash ./debug.sh

docker run -p 6080:80 -p 5900:5900 -v /dev/shm:/dev/shm --network=testnet --name=tester -d --cap-add=SYS_ADMIN tester

TESTER_IP_ADDR=`docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tester`
echo $TESTER_IP_ADDR
# set up port forwarding from host to testnet for vnc:
sysctl net.ipv4.ip_forward=1
iptables -t nat -A PREROUTING -p tcp --dport 5900 -j DNAT --to-destination $TESTER_IP_ADDR:5900

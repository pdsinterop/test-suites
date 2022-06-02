docker run -d --name=firefox -p 5800:5800 -v /tmp/shm:/config:rw --network=testnet --shm-size 2g jlesage/firefox:v1.17.1
echo Now browse to http://ocmhost:5800 to see a Firefox instance that sits inside the Docker testnet.
echo docker exec -it revanc1.docker /bin/bash
echo docker exec -it revanc2.docker /bin/bash
echo echo \"127.0.0.1 \$HOST.docker\" \>\> /etc/hosts
echo export PATH=\$PATH:/usr/local/go/bin
echo cd /reva \; make build-revad \; cd /etc/revad \; /reva/cmd/revad/revad -c /etc/revad/\$HOST.toml


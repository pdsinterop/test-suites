#!/bin/bash
set -e
doctl compute droplet create --image ubuntu-20-04-x64 --size s-4vcpu-8gb --region ams3 --ssh-keys 27704706 --wait dockerhost
echo droplet created
export DOCKERHOST=`doctl compute droplet get dockerhost --format PublicIPv4 | tail -1`
echo IP address is $DOCKERHOST
sudo sed -i '' '/dockerhost/d' /etc/hosts
sed -i '' '/dockerhost/d' ~/.ssh/known_hosts
echo "$DOCKERHOST dockerhost" | sudo tee -a /etc/hosts
doctl compute ssh dockerhost

#!/bin/bash
set -e
doctl compute droplet create --image ubuntu-20-04-x64 --size s-4vcpu-8gb --region ams3 --ssh-keys 27704706 --wait ocmhost
echo droplet created
export OCMHOST=`doctl compute droplet get ocmhost --format PublicIPv4 | tail -1`
echo IP address is $OCMHOST
sudo sed -i '' '/ocmhost/d' /etc/hosts
sed -i '' '/ocmhost/d' ~/.ssh/known_hosts
echo "$OCMHOST ocmhost" | sudo tee -a /etc/hosts
doctl compute ssh ocmhost

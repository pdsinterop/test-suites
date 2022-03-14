#!/bin/bash
set -e
sudo echo # trigger password prompt early in the script
doctl compute droplet create --image ubuntu-20-04-x64 --size s-4vcpu-8gb --region ams3 --ssh-keys 27704706 --wait ocmhost
echo droplet created
export OCMHOST=`doctl compute droplet get ocmhost --format PublicIPv4 | tail -1`
echo IP address is $OCMHOST
sudo sed -i '' '/ocmhost/d' /etc/hosts
sed -i '' '/ocmhost/d' ~/.ssh/known_hosts
echo "$OCMHOST ocmhost" | sudo tee -a /etc/hosts
sleep 10
scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no ./setup.sh root@$OCMHOST:
ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@$OCMHOST /bin/bash ./setup.sh
echo
echo "Now to run the tests, connect to 'vnc://ocmhost' using a VNC client,"
echo "open a terminal (Start->System Tools->LXTerminal)"
echo "and type (sudo password for user 'tester' is '1234'):"
echo "/bin/bash /ubuntu-init-script.sh"
echo "cd ~/ocm-test-suite"
echo "npm run debug"
echo

# ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@$OCMHOST
# or: doctl compute ssh ocmhost

# OCM Test Suite
This test suite tests various implementations of [Open Cloud Mesh (OCM)](https://github.com/cs3org/OCM-API) against each other.

## Overview
The following script runs the testnet on an empty Ubuntu server:
```sh
apt-get update
apt-get install -yq docker.io
docker ps

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout dev

/bin/bash ./build.sh
/bin/bash ./run.sh
```

Then from your laptop connect using VNC (e.g. open `vnc://dockerhost` in Safari), password 1234, you should see an Ubuntu desktop.
You can test that you made it into the testnet by opening Start->Internet->Firefox Web Browser and browsing to https://nc1.docker, once you
click 'accept the risk and continue', you should be able to log in to Nextcloud with 'alice'/'alice123'.

### Known Issues
NB: We recently switched from vps-hosted to in-Docker, and the test suite is still a bit young.
We have successfully used it so far to test OCM between ownCloud and Nextcloud,
and between a stub server and Reva.
You can uncomment these in `./params-docker.js`.
What does not work yet is OCM between Nextcloud/ownCloud  and Reva. We are currently discussing how to move forward
from this situation. Please join https://gitter.im/cs3org/OCM and ping @michielbdejong if you want more up-to-date info and guidance.

Now to run the tests, open a terminal (Start->System Tools->LXTerminal) and type (sudo password for user 'tester' is '1234'):
```sh
/bin/bash /ubuntu-init-script.sh
source ~/.bashrc
cd ~/ocm-test-suite
git checkout dev
npm run debug
```

It tests three flows:

### Public-link flow (login first)
In the public-link flow, the provider gives the consumer a public link, and the consumer clicks 'save to my personal cloud' on there.
In this flow, it is assumed that the consumer is already logged in to their personal cloud account before clicking 'save to my personal cloud' on the public link. After clicking, the consumer is redirected to their personal cloud account GUI, accepts the share, and then leaves it again.

### Public-link flow (login after)
Same as the previous flow, except the consumer is not logged in to their own personal cloud account yet when they get redirected to it
from the public link.

### Share-with flow
In this flow, the provider uses their own personal cloud account GUI to share a resource with the consumer, and the consumer notices this from the notification in their personal cloud acccount GUI, accepts the share, then leaves it again.

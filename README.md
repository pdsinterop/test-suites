# OCM Test Suite
This test suite tests various implementations of [Open Cloud Mesh (OCM)](https://github.com/cs3org/OCM-API) against each other.

## Overview
The following script sets up the testnet on an empty Ubuntu droplet on Digital Ocean (this takes about 15 minutes):
```sh
./doctl-up.sh
```

Then from your laptop connect using VNC (e.g. open `vnc://ocmhost` in Safari), password 1234, you should see an Ubuntu desktop.
You can test that you made it into the testnet by opening Start->Internet->Firefox Web Browser and browsing to https://nc1.docker, once you
click 'accept the risk and continue', you should be able to log in to Nextcloud with 'alice'/'alice123'.

### Known Issues
NB: We recently switched from vps-hosted to in-Docker, and the test suite is still a bit young.

To do: check whether the test suite passes for the following combinations:

* [x] stub - stub
* [x] reva - reva
* [x] nc - nc
* [x] oc - oc
* [?] revanc - revanc
* [ ] cross-tests

Please join https://gitter.im/cs3org/OCM and ping @michielbdejong if you want more up-to-date info and guidance.

### Running the tests
Now to run the tests, open a terminal (Start->System Tools->LXTerminal) and type (sudo password for user 'tester' is '1234'):
```sh
/bin/bash /ubuntu-init-script.sh
cd ~/ocm-test-suite
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

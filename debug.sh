#!/bin/bash

# instead of just running  something like
# /bin/bash ./scripts/run-test.sh "Invite flow" "Stub" "Nextcloud"
# You can also do the steps separately, to debug. So for instance:

# ./scripts/clean.sh
# ./scripts/start-from-Stub.sh
# ./scripts/start-to-Nextcloud.sh

# And then there are really three ways to add a tester to the testnet
# that lets you poke at the "from" and the "to" system::
# 1. The way https://github.com/cs3org/ocm-test-suite/blob/main/.github/workflows/ci.yml and
#    https://github.com/cs3org/ocm-test-suite/blob/main/scripts/run-test.sh do it:
# ./scripts/start-tester-unattended.sh

# 2. Using a Firefox-in-a-box:
# ./scripts/start-tester-firefox.sh 

# 3. Using vnc:
# ./scripts/start-tester-ubuntu.sh

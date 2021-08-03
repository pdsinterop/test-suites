#!/bin/bash
# FIXME: some of this can be moved to the Dockerfile, although not all of it,
# because we want some things to be owned by the 'tester' user, which doesn't
# exist yet at build time (it is created when the container starts up).
# So leaving these here for now.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# note that `source ~/.bashrc` doesn't have the desired effect when executed inside
# a script, due to https://stackoverflow.com/a/38554839/680454
source ~/.nvm/nvm.sh
nvm install 14

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
npm install

# ./node_modules/.bin/jest ocm.test.jest
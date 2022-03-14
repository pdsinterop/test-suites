#!/bin/bash
# FIXME: some of this can be moved to the Dockerfile, although not all of it,
# because we want some things to be owned by the 'tester' user, which doesn't
# exist yet at build time (it is created when the container starts up).
# So leaving these here for now.

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
git checkout main
npm install

# ./node_modules/.bin/jest ocm.test.jest

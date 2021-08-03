#!/bin/bash

sudo apt-get update
sudo apt-get install -y git vim
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source $NVM_DIR/nvm.sh
nvm install 14

git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
npm install

# ./node_modules/.bin/jest ocm.test.jest
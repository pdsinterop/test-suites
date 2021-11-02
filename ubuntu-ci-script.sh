#!/bin/bash
source ~/.nvm/nvm.sh
cd ocm-test-suite
git checkout dev
HEADLESS=1 npm run debug

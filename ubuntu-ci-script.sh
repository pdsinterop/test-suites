#!/bin/bash
source ~/.nvm/nvm.sh
cd ocm-test-suite
git checkout main
HEADLESS=1 npm run debug

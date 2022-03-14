#!/bin/bash
source ~/.nvm/nvm.sh
cd ocm-test-suite
git checkout github-actions-testing
HEADLESS=1 npm run debug

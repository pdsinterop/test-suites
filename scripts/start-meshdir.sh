#!/bin/bash
set -e
docker run -d --network=testnet --name=meshdir.docker  -v /root/ocm-test-suite/ocm-stub:/ocm-stub stub

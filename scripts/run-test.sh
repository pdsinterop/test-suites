#!/bin/bash
set -e
echo "Testing $1 $2 -> $3"
/bin/bash ./scripts/clean.sh
/bin/bash ./scripts/start-from-$2.sh
/bin/bash ./scripts/start-to-$3.sh
/bin/bash ./scripts/start-meshdir.sh

docker run --network=testnet --name=tester.docker -e FLOW="$1" -e FROM_SERVER="$2" -e TO_SERVER="$3" ci

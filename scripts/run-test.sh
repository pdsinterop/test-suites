#!/bin/bash
set -e
echo "Testing $1 $2 -> $3"
echo "Clean..."
/bin/bash ./scripts/clean.sh
echo "Start from $2..."
/bin/bash ./scripts/start-from-$2.sh
echo "Start to $3..."
/bin/bash ./scripts/start-to-$3.sh
echo "Start meshdir..."
/bin/bash ./scripts/start-meshdir.sh
echo "Run tester"
docker run --network=testnet --name=tester.docker -e FLOW="$1" -e FROM_SERVER="$2" -e TO_SERVER="$3" ci

#!/bin/bash
set -e
echo "Running ci tester $1 $2 -> $3"
docker run --network=testnet --name=tester.docker -e FLOW="$1" -e FROM_SERVER="$2" -e TO_SERVER="$3" ci

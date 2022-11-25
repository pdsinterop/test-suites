#!/bin/bash
set -e

./scripts/clean.sh
echo to see the Firefox tester, open `gp url 5800` with your browser
./scripts/nrrn-testing.sh
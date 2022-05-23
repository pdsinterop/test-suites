#!/bin/bash
set -e
docker run -d --network=testnet --name=revad1.docker -e HOST=revad1 revad

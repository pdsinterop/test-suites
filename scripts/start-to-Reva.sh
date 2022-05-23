#!/bin/bash
set -e 
docker run -d --network=testnet --name=revad2.docker -e HOST=revad2 revad

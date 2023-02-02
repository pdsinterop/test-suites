#!/bin/bash
set -e

export DOCKER_BUILDKIT=0
docker login

cd servers/revad
docker build -t pondersource/dev-stock-revad .
docker push pondersource/dev-stock-revad
cd ../nc1
docker build -t pondersource/dev-stock-nc1 .
docker push pondersource/dev-stock-nc1
cd ../nc2
docker build -t pondersource/dev-stock-nc2 .
docker push pondersource/dev-stock-nc2
cd ../oc1
docker build -t pondersource/dev-stock-oc1 .
docker push pondersource/dev-stock-oc1
cd ../oc2
docker build -t pondersource/dev-stock-oc2 .
docker push pondersource/dev-stock-oc2

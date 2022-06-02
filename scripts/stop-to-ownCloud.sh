#!/bin/bash
set -e
docker kill maria2.docker
docker kill oc2.docker
docker rm maria2.docker
docker rm oc2.docker

#!/bin/bash
set -e
docker kill maria1.docker
docker kill oc1.docker
docker rm maria1.docker
docker rm oc1.docker

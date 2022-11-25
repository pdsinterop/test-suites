#!/bin/bash
set -e

echo Log in as marie / radioactivity
docker exec -it revanc2.docker /reva/cmd/reva/reva -insecure -host localhost:19000

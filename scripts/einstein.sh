#!/bin/bash
set -e

echo Log in as einstein / relativity
docker exec -it revanc1.docker /reva/cmd/reva/reva -insecure -host localhost:19000

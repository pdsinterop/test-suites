echo Running server $1 ...
echo Building server image ...
echo : docker build -t $1 servers/$1
docker build -t $1 servers/$1

echo Starting server interactively ...
echo : docker run -it --name=server --network=testnet -p 443:443 $1 /bin/bash
docker run -it --name=server --rm --network=testnet -p 443:443 $1 /bin/bash

echo Exited

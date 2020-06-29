echo Running server $1 ...
echo Building server image ...
echo : docker build -t $1 servers/$1
docker build -t $1 servers/$1

echo Starting server ...
echo : docker run -d --name=server -p 443:443 $1
docker run -d --name=server -p 443:443 $1

echo Will auto-exit afer 20 minutes ...
echo To exit earlier, hit Ctrl-C and run `docker stop server && docker rm server`.
echo : sleep 1200
sleep 1200

echo Been up for 20 minutes, stopping server ...
echo : docker stop server
docker stop server

echo Removing server ...
echo : docker rm server
docker rm server

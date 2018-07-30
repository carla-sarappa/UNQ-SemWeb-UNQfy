docker stop unqfy
docker rm unqfy
docker build -t unqfy ./unqfy_service
docker run --net unqfynet --ip 172.20.0.21 -p 5000:5000 --name unqfy -d unqfy

docker stop notif
docker rm notif
docker build -t notif ./notification_service
docker run --net unqfynet --ip 172.20.0.22 -p 5001:5001 --name notif -d notif

docker ps
docker-machine ls
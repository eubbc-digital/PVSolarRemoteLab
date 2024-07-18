#!/bin/sh
container_id=$(docker ps -aqf "name=SolarLab_Cameras)
docker restart "$container_id"
echo "Restarting camera container..."

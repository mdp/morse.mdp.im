#!/bin/sh

docker build . -t mpercival/morsenews
./bin/docker_podcast_build.sh
./bin/docker_podcast_deploy.sh
#!/bin/sh

docker run --rm -it -v ~/.s3cfg:/root/.s3cfg -v $(pwd)/cache:/usr/src/app/cache \
    mpercival/morsenews ./bin/deploy_podcast.sh
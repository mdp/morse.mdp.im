#!/bin/sh

docker run --rm -v ~/.s3cfg:/root/.s3cfg -v $(pwd)/cache:/usr/src/app/cache \
    mpercival/morsenews ./bin/generate_podcast.sh

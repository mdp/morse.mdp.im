#!/bin/sh

docker run --rm -it -v ~/.s3cfg:/root/.s3cfg \
    mpercival/morsenews ./bin/build_and_deploy_site.sh
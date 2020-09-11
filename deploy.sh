#!/bin/bash

find ./out/ -type f ! -iname 'index.html' ! -name '404.html' -iname '*.html' -print0 | while read -d $'\0' f; do mv "$f" "${f%.html}"; done
docker run --rm -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli s3 sync --delete --acl public-read ./out s3://morse.mdp.im


#!/bin/bash

node podcast.js

rm -rf out
npx next build && npx next export
docker run --rm -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli s3 sync --delete --acl public-read ./out s3://morse.mdp.im

find ./out/ -type f ! -iname 'index.html' ! -name '404.html' -iname '*.html' -print0 | while read -d $'\0' f; do mv "$f" "${f%.html}"; done
docker run --rm -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli s3 cp ./out/ s3://morse.mdp.im/ --content-type text/html --recursive --exclude "*.*"


#!/bin/bash

./node_modules/.bin/next build && ./node_modules/.bin/next export
docker run --rm -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli s3 sync --delete --acl public-read ./out s3://morse.mdp.im


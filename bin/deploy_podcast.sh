#!/bin/sh

# Deploy the podcast
s3cmd sync --delete-removed -P ./cache/podcast/. s3://morse.mdp.im/podcast/

# cp rss files to the S3 Root for legacy podcast feeds
s3cmd put -P ./cache/podcast/*.xml s3://morse.mdp.im/


#!/bin/sh

mkdir -p cache cache/tmp cache/podcast
# Ensure we have the latest that's on production
s3cmd sync --delete-removed s3://morse.mdp.im/podcast/ ./cache/podcast/

# Delete episodes older than 2 weeks
find cache/podcast/*.mp3 -mtime +14 -exec rm {} \;
find cache/podcast/*.txt -mtime +14 -exec rm {} \;

# Build the podcast
yarn build_podcast_audio
yarn build_podcast_rss

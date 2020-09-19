#!/bin/bash


rm -rf out
rm -rf .next
mkdir -p out

mkdir -p archive

node podcast.js
npx next build && npx next export

# Total mess, but s3 syncs based on timestamp.
# Copy to from old archive, then back with the latest
cp -p archive/*.mp3 out/.
cp -p archive/*.txt out/.
cp -p out/*.mp3 archive/.
cp -p out/*.txt archive/.

# Rename wpm.html for s3
find ./out/ -type f ! -iname 'index.html' ! -name '404.html' -iname '*.html' -print0 | while read -d $'\0' f; do mv "$f" "${f%.html}"; done

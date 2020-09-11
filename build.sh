#!/bin/bash


rm -rf out
mkdir -p out


npx next build && npx next export

# Rename wpm.html for s3
find ./out/ -type f ! -iname 'index.html' ! -name '404.html' -iname '*.html' -print0 | while read -d $'\0' f; do mv "$f" "${f%.html}"; done

node podcast.js
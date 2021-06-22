#!/bin/sh

rm -rf out
rm -rf .next
mkdir -p out

npx next build && npx next export

s3cmd put -P ./out/*.html s3://morse.mdp.im/
s3cmd put -P ./out/*.jpg s3://morse.mdp.im/
s3cmd sync --delete-removed -P ./out/_next s3://morse.mdp.im/
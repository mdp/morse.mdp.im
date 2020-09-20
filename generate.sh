#!/bin/bash

mkdir -p tmp
rm -rf tmp/*
find public/*.mp3 -mtime +14 -exec rm {} \;
find public/*.txt -mtime +14 -exec rm {} \;
node index.js

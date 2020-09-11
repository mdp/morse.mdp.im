#!/bin/bash


rm -rf out
mkdir -p out
npx next build && npx next export

node podcast.js
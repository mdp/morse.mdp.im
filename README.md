# Morse Code Headlines

## Credit

Most of the credit goes to [Stephen C. Phillips](https://scphillips.com/) for his excellent [Morse Pro library](https://github.com/scp93ch/morse-pro) which I use to create the mp3 files for the headlines.

## Requirement

- Node >= 14.x
- ffmpeg installed

# Deployment

## Build the required docker image
docker build . -t mpercival/morsenews

## Generate and deploy a new episode of the podcast

docker run --rm -it -v ~/.s3cfg:/root/.s3cfg -v $(pwd)/cache:/usr/src/app/cache  mpercival/morsenews ./generate_podcast.sh

## Generate and deploy the latest webstie

`yarn next build && yarn next export && aws s3 sync out/. s3://morse.mdp.im/ --exclude 'podcast/*'`

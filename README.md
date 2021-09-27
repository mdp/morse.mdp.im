# Morse Training App

This webapp started as Morse Code Headlines, which produces both a [podcast](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-25-wpm/id1536964268), and a [website](https://morse.mdp.im) with up to date headlines.

Lately I've been updating it to include a [mobile optimized Morse trainer focused on headcopy](https://morse.mdp.im/head-copy/)

### Credits

Most of the credit goes to [Stephen C. Phillips](https://scphillips.com/) for his excellent [Morse Pro library](https://github.com/scp93ch/morse-pro) which I use to create the mp3 files for the headlines. Credit also goes to Kurt Zoglmann who open sourced Morse Code Ninja where I was able to get great word/callsign/training lists from. 

## Headcopy Mobile Game

### Goals

- Should be optimized for mobile users
    - No keyboard entry, multiple choice
    - Should work on a variety of devices and mobile browsers
    - Ideally should not require an application to be installed
    - No signup or login, user can get started immediately
- Should encourage headcopy (make the user wait until completion of callsign or phrase to answer)
- Free of any requirement for a backend server (static website)
    - Low data usage for mobile users
    - Should be hostable with almost no cost
- Scoring/gamification should encourage the user to shoot for a long term goal (e.g. decode
50k characters) versus getting discouraged by periods little or no improvement.
- Should be easy for developers to implement new game modes and game data (e.g. Top 100 words, DXCC100 Calls, etc.)
- Open source and free forever!

### Current Status

It's live in an early beta, but I'm sure there are bugs.

### Requirements

- Node >= 14.x

### Development

- `git clone `
- `cd morse.mdp.im`
- `yarn install`
- `yarn run dev`
- Open your browser to localhost:3000/head-copy/

## Morse Code Headlines

This is both a web application and a podcast generator.

### Requirements

- Node >= 14.x
- ffmpeg installed

### Deployment

### Build the required docker image
docker build . -t mpercival/morsenews

### Generate and deploy a new episode of the podcast

docker run --rm -it -v ~/.s3cfg:/root/.s3cfg -v $(pwd)/cache:/usr/src/app/cache  mpercival/morsenews ./generate_podcast.sh

## Generate and deploy the latest website

`yarn next build && yarn next export && aws s3 sync out/. s3://morse.mdp.im/ --exclude 'podcast/*'`

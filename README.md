# Morse Training App
[![Podcast Deploy](https://github.com/mdp/morse.mdp.im/actions/workflows/podcast_cron.yaml/badge.svg)](https://github.com/mdp/morse.mdp.im/actions/workflows/podcast_cron.yaml)
[![CI](https://github.com/mdp/morse.mdp.im/actions/workflows/build.yaml/badge.svg)](https://github.com/mdp/morse.mdp.im/actions/workflows/build.yaml)
[![Codespaces](https://img.shields.io/badge/Codespaces-Launch-brightgreen)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=278430466)

[![MorseHeadCopy](https://user-images.githubusercontent.com/2868/160646418-083953b9-c6f2-4a61-a15b-97e8c863986b.png)](/)

**A [webbased game](https://morse.mdp.im/head-copy) and [podcast](https://morse.mdp.im/news/) focused on learning to "head copy" morse code.**

## News Headlines in Morse Code Podcast

This podcast is released twice a day and includes the latest news headlines, delivered in Morse Code at the selected speed ([Listen to an example](https://tunein.com/podcasts/p1766440/)).

- [10 WPM RSS](https://morse.mdp.im/podcast/rss-10.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-10-wpm/id1615630558)
- [15 WPM RSS](https://morse.mdp.im/podcast/rss-15.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-15-wpm/id1533526598)
- [20 WPM RSS](https://morse.mdp.im/podcast/rss-20.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-20-wpm/id1531399638)
- [25 WPM RSS](https://morse.mdp.im/podcast/rss-25.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-25-wpm/id1536964268)
- [30 WPM RSS](https://morse.mdp.im/podcast/rss-30.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-30-wpm/id1656007282)
- [35 WPM RSS](https://morse.mdp.im/podcast/rss-35.xml) / [iTunes](https://podcasts.apple.com/us/podcast/news-headlines-in-morse-code-at-35-wpm/id1656007555)

-----

## Credits

Most of the credit goes to [Stephen C. Phillips](https://scphillips.com/) for his excellent [Morse Pro library](https://github.com/scp93ch/morse-pro) which I use to create the mp3 files for the headlines. Credit also goes to Kurt Zoglmann who [open sourced](https://github.com/zoglmannk/Morse-Code-Ninja) [Morse Code Ninja](https://morsecode.ninja/) where I was able to get great word/callsign/training lists from. 

-----

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

### Requirements

- Node >= 17.x

### Development

The easiest way to get started is to fork this project and open up a Github Codespace. It should work out of the box.

If you want to develop on your own machine, use the following:

- `git clone `
- `cd morse.mdp.im`
- `yarn install`
- `yarn dev`
- Open your browser to localhost:3000/head-copy/

## Morse Code Headlines

This is both a web application and a podcast generator.

### Requirements

- Node >= 17.x
- ffmpeg installed

## Deployment

All deployment is scheduled and handled via Github Actions, however, it's possible
to deploy a podcast to your own AWS S3 bucket using the following:

### Generate and deploy a podcast locally

Assumes you have the required env variables (NEWSAPI_KEY and AWS keys)

#### Create a new podcast and upload it to S3 (15wpm / 25wpm character speed)

`yarn ts-node podcast/bin/new_podcast.ts -w 15 -f 25 --prefix podcast morse.mdp.im`

#### Update RSS feed (15/25wpm) based on S3 contents

`yarn ts-node podcast/bin/update_rss.ts -w 15 -f 25 --prefix podcast morse.mdp.im`

#### Update headlines.json (updates website headline game)

`yarn ts-node podcast/bin/update_headlines.ts --prefix podcast morse.mdp.im`

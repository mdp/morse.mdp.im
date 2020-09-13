const config = require("./config.json")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util");
const Podcast = require('podcast')
const { parseFilename, getMp3s } = require('./lib/utils');
const { group } = require("console");

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);


async function getFiles(config) {
  const outputDir = config.output.outputDir;
  const files = await readdir(outputDir)
  const mp3s = await getMp3s(files)
  
  let groupedEpisodes = {}

  const speeds = [
    [20,20],
    [20,15],
  ]

  for (let i=0; speeds.length > i; i++) {
    let [wpm, fwpm] = speeds[i]
    groupedEpisodes[fwpm] = groupedEpisodes[fwpm] || []
    for (let j=0; mp3s.length > j; j++) {
      let mp3 = mp3s[j]
      if (mp3.wpm === wpm && mp3.fwpm === fwpm && mp3.name === "News Headlines" && mp3.repeat === "1x") {
        mp3.content = await readFile(outputDir + '/' + mp3.filename.replace(/mp3$/, 'txt'), "utf-8")
        mp3.length = await statFile(outputDir + '/' + mp3.filename.replace(/mp3$/, 'txt'), "utf-8")['size']
        mp3.url = `https://${config.host}/${mp3.filename}`
        groupedEpisodes[fwpm].push(mp3)
      }

    }
  }

  return groupedEpisodes
}

async function buildPodcast(config, podcastEpisodes) {
  const outputDir = config.output.outputDir
  // Get all podcast files for a wpm
  // Iterate other them and add them to the feed in order of newest to oldest
  // Delete files older than x days
  const speeds = Object.keys(podcastEpisodes)
  for (let i=0; speeds.length > i; i++) {
    const wpm = speeds[i]
    episodes = podcastEpisodes[wpm]
    const feed = new Podcast({
      title: `News Headlines in Morse Code at ${wpm} WPM`,
      description: 'News Headlines in Morse code, updated daily',
      feed_url: 'http://morse.mdp.im/rss-${wpm}.xml',
      site_url: 'http://morse.mdp.im',
      image_url: 'http://morse.mdp.im/podcast_cover.jpg',
      author: 'Mark Percival',
      managingEditor: 'Mark Percival',
      webMaster: 'Mark Percival',
      copyright: `${(new Date).getFullYear()} Mark Percival`,
      language: 'en',
      categories: ['Morse Code', 'Amateur Radio', 'Ham Radio'],
      pubDate: Date.now(),
      ttl: '360',
      itunesAuthor: 'Mark Percival',
      itunesSubtitle: "News Headlines in Morse Code",
      itunesSummary: 'Daily updated news headlines in morse code',
      itunesOwner: { name: 'Mark Percival', email: 'm@mdp.im' },
      itunesExplicit: false,
      itunesCategory: [{
        "text": "News",
        "subcats": [{
          "text": "Daily News"
        }]
      }],
      itunesImage: 'http://morse.mdp.im/podcast_cover.jpg'
    });
    for (let j=0; episodes.length > j; j++) {
      let episode = episodes[j]
      feed.addItem({
        title: `News Headlines at ${episode.fwpm}`,
        description: episode.content,
        url: `https://${config.host}`, // link to the item
        date: entities.encode(episode.date),
        enclosure: { url: episode.url, file: `./${outputDir}/${episode.filename}` },
        itunesAuthor: 'Mark Percival',
        itunesExplicit: false,
        itunesSubtitle: 'News Headlines in Morse Code',
        itunesSummary: 'Morse Code Headlines',
      });
    }
    await writeFile(`${config.output.outputDir}/rss-${wpm}.xml`, feed.buildXml())
  }

}

async function main(config) {
  episodes = await getFiles(config)
  await buildPodcast(config, episodes)
  console.log("Podcast feeds built")
}



main(config).catch(error => console.error(error));

const config = require("./config.json")
const fs = require("fs")
const { promisify } = require("util");
const Podcast = require('podcast')
const { parseFilename } = require('./lib/utils');
const { group } = require("console");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);


async function getFiles(config) {
  const outputDir = config.output.outputDir;
  const files = await readdir(outputDir)

  const mp3s = files.filter((file) => path.extname(file).toLowerCase() === '.mp3').map(parseFilename).sort((a,b) => { 
    if (a.date > b.date) {
      return -1
    }
    return 1
  })
  
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
      title: `News Headlines at ${wpm} WPM`,
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
      itunesSubtitle: 'I am a sub title',
      itunesSummary: 'I am a summary',
      itunesOwner: { name: 'Mark Percival', email: 'm@mdp.im' },
      itunesExplicit: false,
      itunesCategory: [{
        "text": "Entertainment",
        "subcats": [{
          "text": "Television"
        }]
      }],
      itunesImage: 'http://morse.mdp.im/image.png'
    });
    for (let j=0; episodes.length > j; j++) {
      let episode = episodes[j]
      feed.addItem({
        title: `Morse Code Headlines at ${episode.fwpm}`,
        description: episode.content,
        url: `https://${config.host}`, // link to the item
        date: episode.pubDate,
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
  console.log(episodes)
  await buildPodcast(config, episodes)
}



main(config).catch(error => console.error(error));
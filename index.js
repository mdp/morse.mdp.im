const config = require("./config.json")
const keys = require("./keys.json")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util");

const Parser = require('rss-parser');
const parser = new Parser();

const NewsAPI = require("newsapi")
const newsapi = new NewsAPI(keys.newsapi_key)

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const exec = promisify(require('child_process').exec);
const headlines = promisify(newsapi.v2.topHeadlines);


const MorseCWWave = require("morse-pro/lib/morse-pro-cw-wave").default
const riffwave = require("morse-pro/lib/morse-pro-util-riffwave").getData

const reserved = {
  "/":"[Slash]",
  "?":"[QMark]",
  "<":"[",
  ">":"]"
}

function sanitize(chars) {
  let out = ""
  for (let i=0; i<chars.length; i++) {
    const sub = reserved[chars[i]]
    if (sub) {
      out = out.concat(sub)
    } else {
      out = out.concat(chars[i])
    }
  }
  return out
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function createAudioFile(content, out, wpm, farnsworth) {
  const morseCWWave = new MorseCWWave(true, wpm, farnsworth)
  const outFileWav = `${out}.wav`
  const outFileMP3 = `${out}.mp3`
  console.log(content)
  morseCWWave.translate(content)
  console.log(content)
  await writeFile(outFileWav,
    Buffer.from(riffwave(morseCWWave.getSample()))
  )
  console.log(`Written ${outFileWav}`)
  // TODO: Error check this
  let { stdout, stderr } = await exec(`ffmpeg -i ${outFileWav} -y -codec:a libmp3lame -b:a 160k ${outFileMP3}`)
  await unlink(outFileWav)
  console.log(`Compressed ${outFileMP3}`)
}

async function buildAudioFiles(name, outputDir, speeds, content) {
  for (let j=0; j < speeds.length; j++) {
    const [wpm, fwpm] = speeds[j]
    const out = outputDir + `/${name}-${wpm}x${fwpm}-${Date.now()}`
    console.info(`Creating audio for ${name} at ${wpm} wpm and a farnsworth speed of ${fwpm}`)
    await createAudioFile(content, out, wpm, fwpm)
  }
}

function cleanTitles(txt) {
  txt = txt.split(" - ")[0] // Lose the ending attribution
  txt = txt.replace(/[\-]/g," ") // Hyphens, seldom used in morse and seldom needed
  txt = txt.replace(/[^a-zA-Z0-9\s\.\,]/g,"") // Just letters, numbers, commas and periods
  txt = txt.replace(/\s{2,}/g," ") // Get rid of any weird spacing
  return txt
}

// Returns a list of ArsTechnica title
async function arsTechnicaFeed() {
  let feed = await parser.parseURL('http://feeds.arstechnica.com/arstechnica/technology-lab');

  const titles = feed.items.map(i => i.title);
  const cleanedTitles = shuffle(titles.map(cleanTitles));
  return {
    "Tech_Headlines": cleanedTitles
  }
}

// Returns a list of NewsAPI
async function newsAPIFeed(api_key) {
  const newsapi = new NewsAPI(api_key);
  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them
  const output = {}
  for (let i=0; i<config.news_queries.length; i++) {
    const results = await headlines(config.news_queries[i].query)
    const titles = results.articles.map(a => a['title']);
    const cleanedTitles = shuffle(titles.map(cleanTitles));
    const name = `${config.news_queries[i].name}_Headlines`
    output[name] = cleanedTitles
  }
  return output
}

async function main(config, api_key) {
  const ars = await arsTechnicaFeed()
  const newsAPI = await newsAPIFeed(api_key)

  Object.keys(ars).forEach( async (k) => {
    let headlineTitles = ars[k].join(" <AR> <AR> ")
    headlineTitles = `vvv vvv ${headlineTitles} <SK> <SK> <SK>`

    let headlineTitlesRepeated = ars[k].slice(0,9).map((t) => `${t} <BT> ${t} <BT> ${t}`).join(" <AR> <AR> ")
    headlineTitlesRepeated = `vvv vvv ${headlineTitlesRepeated} <SK> <SK> <SK>`
    console.log(headlineTitles)
    console.log(headlineTitlesRepeated)
    const output = config.output
    await buildAudioFiles(k + '-1x', output.outputDir, output.speeds, headlineTitles)
    await buildAudioFiles(k + '-3x', output.outputDir, output.speeds, headlineTitlesRepeated)
  })

  Object.keys(newsAPI).forEach( async (k) => {
    let headlineTitles = newsAPI[k].join(" <AR> <AR> ")
    headlineTitles = `vvv vvv ${headlineTitles} <SK> <SK> <SK>`

    let headlineTitlesRepeated = newsAPI[k].slice(0,9).map((t) => `${t} <BT> ${t} <BT> ${t}`).join(" <AR> <AR> ")
    headlineTitlesRepeated = `vvv vvv ${headlineTitlesRepeated} <SK> <SK> <SK>`
    console.log(headlineTitles)
    console.log(headlineTitlesRepeated)
    const output = config.output
    await buildAudioFiles(k + '-1x', output.outputDir, output.speeds, headlineTitles)
    await buildAudioFiles(k + '-3x', output.outputDir, output.speeds, headlineTitlesRepeated)
  })

}

main(config, keys['newsapi_key']).catch(error => console.error(error));

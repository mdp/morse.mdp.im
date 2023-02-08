import NewsAPI from 'newsapi'

import { promisify } from 'util';

const config = {
  "name": "News_Headlines",
  "query": {
    "pageSize": 10,
    "sources": "bbc-news",
    "language": "en"

  }
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

type CleanTitlesOptions = {
  attribution?: boolean,
}

function cleanTitles(options: CleanTitlesOptions = {}) {
  return (txt) => {
    if (options.attribution) {
      txt = txt.split(" - ")[0] // Lose the ending attribution
    }
    txt = txt.replace(/[\-]/g, " ") // Hyphens, seldom used in morse and seldom needed
    txt = txt.replace(/['’]/g, "") // apostrophes should just disappear
    txt = txt.replace(/[&]/g, " and ") // less confusing ampersands
    txt = txt.replace(/[^a-zA-Z0-9\s\.\,]/g, " ") // Just letters, numbers, commas and periods
    txt = txt.replace(/\s{2,}/g, " ") // Get rid of any weird spacing
    return txt
  }
}

// Returns a list of NewsAPI
export async function fetchHeadlines(apiKey): Promise<string[]> {
  const newsapi = new NewsAPI(apiKey);
  const headlines = promisify(newsapi.v2.topHeadlines);
  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them
  const results = await headlines(config.query)
  const titles = results.articles.map(a => a['title']);
  const cleanedTitles = shuffle(titles.map(cleanTitles({ attribution: false })));
  console.log(results)
  return cleanedTitles
}

export function headlinesToMorse(headlines: string[]): string {
  let headlineTitles = headlines.join(" <AR> <AR> ")
  headlineTitles = `vvv vvv ${headlineTitles} <SK> <SK> <SK>`
  return headlineTitles
}


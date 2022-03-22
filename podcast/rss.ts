import { Podcast as PodcastEpisode } from "./podcast"
import { Podcast } from "podcast"
import { XmlEntities as Entities } from 'html-entities'

const entities = new Entities();

export async function buildPodcast(podcasts: PodcastEpisode[]) {
    const wpm = podcasts[0].wpm;
    const feed = new Podcast({
      title: `News Headlines in Morse Code at ${wpm} WPM`,
      description: 'News Headlines in Morse code, updated daily',
      feedUrl: `https://morse.mdp.im/podcast/rss-${wpm}.xml`,
      siteUrl: `https://morse.mdp.im/#${wpm}wpm`,
      imageUrl: `https://morse.mdp.im/podcast_cover_${wpm}.jpg`,
      author: 'Mark Percival',
      managingEditor: 'Mark Percival',
      webMaster: 'Mark Percival',
      copyright: `${(new Date).getFullYear()} Mark Percival`,
      language: 'en',
      categories: ['Morse Code', 'Amateur Radio', 'Ham Radio'],
      pubDate: (new Date()).toISOString(),
      ttl: 360,
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
      itunesImage: `https://morse.mdp.im/podcast_cover_${wpm}.jpg`,
    });
    for (let j=0; podcasts.length > j; j++) {
      let episode: PodcastEpisode = podcasts[j]
      const content = await episode.transcription()
      feed.addItem({
        title: `News Headlines at ${episode.fwpm}`,
        description: entities.encode(content),
        url: episode.audioUrl(), // link to the item
        date: episode.date(),
        enclosure : {
          url: episode.audioUrl(),
          size: await episode.size(),
          type: 'audio/mpeg'
        },
        itunesAuthor: 'Mark Percival',
        itunesExplicit: false,
        itunesSubtitle: 'News Headlines in Morse Code',
        itunesSummary: 'Morse Code Headlines',
      });
    }
    return feed.buildXml()
}

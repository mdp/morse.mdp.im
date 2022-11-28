import { Podcast as PodcastEpisode } from "./podcast"
import { Podcast } from "podcast"
import { XmlEntities as Entities } from 'html-entities'

const entities = new Entities();

export async function buildPodcast(podcasts: PodcastEpisode[]) {
    const fwpm = podcasts[0].fwpm;
    const feed = new Podcast({
      title: `News Headlines in Morse Code at ${fwpm} WPM`,
      description: 'News Headlines in Morse code, updated daily',
      feedUrl: `https://morse.mdp.im/podcast/rss-${fwpm}.xml`,
      siteUrl: `https://morse.mdp.im/news/#${fwpm}`,
      imageUrl: `https://morse.mdp.im/podcast_cover_${fwpm}.jpg`,
      author: 'Mark Percival',
      managingEditor: 'Mark Percival',
      webMaster: 'Mark Percival',
      copyright: `${(new Date).getFullYear()} Mark Percival`,
      language: 'en',
      categories: ['Morse Code', 'Amateur Radio', 'Ham Radio'],
      pubDate: (new Date()).toISOString(),
      ttl: 360,
      itunesAuthor: 'Mark Percival',
      itunesSubtitle: `News Headlines in Morse Code at ${fwpm} WPM`,
      itunesSummary: 'Daily updated news headlines in morse code',
      itunesOwner: { name: 'Mark Percival', email: 'm@mdp.im' },
      itunesExplicit: false,
      itunesCategory: [{
        "text": "News",
        "subcats": [{
          "text": "Daily News"
        }]
      }],
      itunesImage: `https://morse.mdp.im/podcast_cover_${fwpm}.jpg`,
    });
    for (let j=0; podcasts.length > j; j++) {
      let episode: PodcastEpisode = podcasts[j]
      await episode.fetch()
      const contentHeader = `Morse code transcription: <br /><br />`
      const content = episode.transcription
      feed.addItem({
        title: `News Headlines at ${episode.fwpm}`,
        description: contentHeader + entities.encode(content),
        url: episode.audioUrl, // link to the item
        date: episode.date,
        enclosure : {
          url: episode.audioUrl,
          size: episode.size,
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

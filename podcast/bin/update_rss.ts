/**
# Steps to update the podcast

1. Generate a new podcast based on headlines locally
2. Upload files to s3 podcast directory
3. List objects in S3 directory
4. Filter and create a list of "expired" and "deleted" podcasts
5. Filter and create a list of text files for wpm from current podcasts
6. Fetch all text files for wpm
7. Generate RSS based on text file contents, linking to mp3s
8. Upload RSS/Overwrite existing
9. Delete "expired podcasts" (need a window here, say 1 week of expired, then deleted)


Make a class to pull a bucket at a certain wpm, get a list of deleted podcasts, get a list of valid ones, and get the content

**/
import 'dotenv/config'
import { Command } from 'commander';
const program = new Command();

import {DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { Podcast } from '../podcast';
import { buildPodcast } from '../rss';

const s3Client = new S3Client({region: 'us-east-1'});

program
  .requiredOption('-f, --fwpm <num>')
  .requiredOption('-w, --wpm <num>')
  .option('--expireAfter <num>', 'expired after x episodes', '30')
  .option('--deleteAfter <num>', 'deleted after x episodes', '45')
  .option('--prefix <string>')
  .argument("<string>", "bucket")

program.parse()


async function main() {
    const opts = program.opts()
    const bucket = program.args[0]
    const prefix = opts['prefix'] || ""

    const expireAfter = opts['expireAfter'] || ""
    const deleteAfter = opts['deleteAfter'] || ""

    const wpm = parseInt(opts['wpm'], 10)
    const fwpm = parseInt(opts['fwpm'], 10)

    const objs = await s3Client.send(new ListObjectsCommand({Bucket: bucket, Prefix: prefix}));

    const allPodcasts = objs.Contents.map((obj) => new Podcast({key: obj.Key, bucket, s3Client})).filter((p) =>
        p.type === 'json' && p.wpm === wpm && p.fwpm == fwpm
    ).sort((a, b) => (a.timestamp > b.timestamp)? -1 : 1);

    allPodcasts.forEach((p) => console.log(new Date(p.timestamp).toISOString()))

    const currentPodcasts: Podcast[] = [];
    const deletedPodcasts: Podcast[] = [];

    // Only list the most recent podcasts
    if (allPodcasts.length > expireAfter) {
        currentPodcasts.push(...allPodcasts.slice(0, expireAfter))
    } else {
        currentPodcasts.push(...allPodcasts)
    }

    if (allPodcasts.length > deleteAfter) {
        deletedPodcasts.push(...allPodcasts.slice(deleteAfter))
    }

    console.log(`${currentPodcasts.length} Podcasts to be published`)
    console.log(`${deletedPodcasts.length} Podcasts to be deleted`)

    const rss = await buildPodcast(currentPodcasts)
    await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `${prefix}/rss-${fwpm}.xml`, 
        Body: rss,
        ContentType: "application/rss+xml",
    }))

    for (const podcast of deletedPodcasts) {
        await podcast.destroy()
    }
    
}

main().then(() => process.exit()).catch((err) => {
    console.log(err)
    process.exit(1)
})



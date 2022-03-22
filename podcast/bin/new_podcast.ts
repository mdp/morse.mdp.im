import 'dotenv/config'
import { Command } from 'commander';
const program = new Command();

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PodcastJson } from '../podcast';
import { generate } from '../generate';
import { fetchHeadlines, headlinesToMorse } from '../headlines';
import path from 'path';
import { writeFile, readFile } from 'fs/promises';

const s3Client = new S3Client({region: 'us-east-1'});

program
  .requiredOption('-f, --fwpm <num>')
  .requiredOption('-w, --wpm <num>')
  .option('--prefix <string>')
  .argument("<string>", "bucket")

program.parse()


async function main() {
    if (!process.env["NEWSAPI_KEY"] || !process.env["AWS_ACCESS_KEY_ID"]) {
        console.log("Can only run with NEWSAPI_KEY and AWS credentials")
        console.log(process.env)
        process.exit(-1)
    }

    const now = Date.now();

    const opts = program.opts()
    const bucket = program.args[0]
    const prefix = opts['prefix'] || ""
    const wpm = parseInt(opts['wpm'], 10)
    const fwpm = parseInt(opts['fwpm'], 10)

    const headlines = await fetchHeadlines(process.env["NEWSAPI_KEY"]);
    const headlineMorse = headlinesToMorse(headlines);

    const tmpDir = path.resolve(__dirname, '../tmp')
    const filePrefix = `News_headlines-1x-${wpm}x${fwpm}-${now}`
    const pathPrefix = path.join(tmpDir, filePrefix)
    const keyPrefix = `${prefix}/${filePrefix}`


    const length = await generate({wpm, fwpm, content: headlineMorse, out: pathPrefix});
    if (length) {

        const json: PodcastJson = {
            audioKey: keyPrefix + ".mp3",
            content: headlines,
            size: length,
            transcription: headlineMorse,
            bucket,
            host: 's3',
            timestamp: now,
        }
        await writeFile(pathPrefix + ".json", JSON.stringify(json), 'utf-8');

        console.log(`Created podcast - ${filePrefix}`)
        const audioBuffer = await readFile(pathPrefix + ".mp3");

        // Upload all files to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: bucket, Key: keyPrefix + ".json", Body: JSON.stringify(json),
            ContentType: "application/json"
        }))
        await s3Client.send(new PutObjectCommand({
            Bucket: bucket, Key: keyPrefix + ".mp3", Body: audioBuffer,
            ContentType: "audio/mpeg"
        }))

    }


}

main().then(() => process.exit()).catch((err) => {
    console.log(err)
    process.exit(1)
})

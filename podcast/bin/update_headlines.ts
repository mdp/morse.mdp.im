import 'dotenv/config'
import { Command } from 'commander';
const program = new Command();

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fetchHeadlines } from '../headlines';

const s3Client = new S3Client({region: 'us-east-1'});

program
  .option('--prefix <string>')
  .argument("<string>", "bucket")

program.parse()

type HeadlineJson = {
    content: string[]
    timestamp: number
}

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

    const headlines = await fetchHeadlines(process.env["NEWSAPI_KEY"]);

    const headlinesJsonKey = `${prefix}/headlines.json`

    const json: HeadlineJson = {
        content: headlines,
        timestamp: now,
    }

    console.log(`Updating with ${headlines.length} headlines`)

    // Upload JSON for Website
    await s3Client.send(new PutObjectCommand({
        Bucket: bucket, Key: headlinesJsonKey, Body: JSON.stringify(json),
        ContentType: "application/json"
    }))
    console.log(`Saved to S3: ${bucket}:${headlinesJsonKey}`)

}

main().then(() => process.exit()).catch((err) => {
    console.log(err)
    process.exit(1)
})

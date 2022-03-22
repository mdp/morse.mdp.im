import { DeleteObjectCommand, GetObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";

const streamToString = (stream): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

export type PodcastJson = {
    transcription: string
    content: string[]
    audioKey: string
    size: number
    bucket: string
    host: string
    timestamp: number
}

export class Podcast {
    key: string
    bucket: string
    name: string
    wpm: number
    fwpm: number
    timestamp: number
    type: string
    s3client: S3Client
    private _content: PodcastJson | null

    constructor({key, bucket, s3Client}: {key: string, bucket: string, s3Client: S3Client}) {
        this.key = key;
        this.bucket = bucket;
        this.s3client = s3Client;

        try {
            const parts = key.split("-")
            this.name = parts[0].split("/")[1];
            [this.wpm, this.fwpm] = parts[2].split("x").map((s) => parseInt(s, 10));
            this.timestamp = parseInt(parts[3].split(".")[0], 10)
            this.type = parts.slice(-1)[0].split(".").slice(-1)[0];
        } catch (err) {
            console.log("unable to parse", key)
        }
    }


    url(): string {
        return `https://${this.bucket}/${this.key}`
    }

    mp3Key(): string {
        return this.key.replace(/\..+$/, '.mp3')
    }

    audioUrl(): string {
        return `https://${this.bucket}/${this.mp3Key()}`
    }

    date(): Date {
        return new Date(this.timestamp)
    }

    async fetch(): Promise<PodcastJson> {
        if (this._content) {
            return this._content
        }
        const content = await this.s3client.send(new GetObjectCommand({Bucket: this.bucket, Key: this.key}));
        const body = await streamToString(content.Body)
        this._content = JSON.parse(body)
        return this._content
    }

    async transcription(): Promise<string> {
        const c = await this.fetch()
        return c.transcription
    }

    async size(): Promise<number> {
        const c = await this.fetch()
        return c.size
    }

    async destroy(): Promise<void> {
        await this.s3client.send(new DeleteObjectCommand({Bucket: this.bucket, Key: this.key}));
        try {
            await this.s3client.send(new DeleteObjectCommand({Bucket: this.bucket, Key: this.mp3Key()}));
        } catch(err) {
            console.log('unable to delete mp3 of ', this.key)
        }
    }

}
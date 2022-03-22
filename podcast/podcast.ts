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

    async fetch(): Promise<PodcastJson> {
        if (this._content) {
            return this._content
        }
        const content = await this.s3client.send(new GetObjectCommand({Bucket: this.bucket, Key: this.key}));
        const body = await streamToString(content.Body)
        this._content = JSON.parse(body)
        return this._content
    }

    get audioKey(): string {
        this.ensureFetched()
        return this._content.audioKey
    }

    get audioUrl(): string {
        return `https://${this.bucket}/${this.audioKey}`
    }

    get date(): Date {
        return new Date(this.timestamp)
    }

    get transcription(): string {
        this.ensureFetched()
        return this._content.transcription
    }

    get size(): number {
        this.ensureFetched()
        return this._content.size
    }

    async destroy(): Promise<void> {
        await this.fetch()
        await this.s3client.send(new DeleteObjectCommand({Bucket: this.bucket, Key: this.key}));
        console.log("Deleted: ", this.key)
        await this.s3client.send(new DeleteObjectCommand({Bucket: this.bucket, Key: this.audioKey}));
        console.log("Deleted: ", this.audioKey)
    }

    private ensureFetched(): void {
        if (!this._content) {
            throw new Error("Fetch first")
        }
    }

}
import { DownloadSample } from "./DownloadSample.ts";

const UNCOMPRESSED = { "Accept-Encoding": "identity" };

export interface Downloader
{
    download(url: string): Promise<DownloadSample>;
}

export class HttpDownloader implements Downloader
{
    private readonly fetch: typeof fetch;

    constructor(fetchImplementation: typeof fetch = fetch)
    {
        this.fetch = fetchImplementation;
    }

    async download(url: string): Promise<DownloadSample>
    {
        const requestStartedAt = performance.now();
        const response = await this.request(url);

        const transferStartedAt = performance.now();
        const bytes = await this.countBytes(response);
        const finishedAt = performance.now();

        return new DownloadSample(bytes, finishedAt - requestStartedAt, finishedAt - transferStartedAt);
    }

    private async request(url: string): Promise<Response>
    {
        const response = await this.send(url);

        if (!response.ok)
        {
            throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
        }

        return response;
    }

    private async send(url: string): Promise<Response>
    {
        try
        {
            return await this.fetch(url, { headers: UNCOMPRESSED });
        }
        catch (error)
        {
            const reason = error instanceof Error && error.cause instanceof Error ? error.cause : error;
            throw new Error(reason instanceof Error ? reason.message : String(reason), { cause: error });
        }
    }

    private async countBytes(response: Response): Promise<number>
    {
        let bytes = 0;

        for await (const chunk of response.body ?? [])
        {
            bytes += chunk.byteLength;
        }

        return bytes;
    }
}

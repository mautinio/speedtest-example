import type { Downloader } from "./Downloader.ts";
import type { DownloadSample } from "./DownloadSample.ts";
import { SpeedReport } from "./SpeedReport.ts";

export type SampleListener = (attempt: number, sample: DownloadSample) => void;

export class SpeedTest
{
    private readonly downloader: Downloader;
    private readonly requestCount: number;

    constructor(downloader: Downloader, requestCount: number)
    {
        this.downloader = downloader;
        this.requestCount = requestCount;
    }

    async run(url: string, onSample?: SampleListener): Promise<SpeedReport>
    {
        const samples: DownloadSample[] = [];

        for (let attempt = 1; attempt <= this.requestCount; attempt++)
        {
            const sample = await this.downloader.download(url);
            samples.push(sample);
            onSample?.(attempt, sample);
        }

        return new SpeedReport(samples);
    }
}

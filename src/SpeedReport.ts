import type { DownloadSample } from "./DownloadSample.ts";

export class SpeedReport
{
    private readonly samples: readonly DownloadSample[];

    constructor(samples: readonly DownloadSample[])
    {
        this.samples = [...samples];
    }

    get totalBytes(): number
    {
        return this.samples.reduce((sum, sample) => sum + sample.bytes, 0);
    }

    get totalDurationMs(): number
    {
        return this.samples.reduce((sum, sample) => sum + sample.durationMs, 0);
    }

    get totalTransferMs(): number
    {
        return this.samples.reduce((sum, sample) => sum + sample.transferMs, 0);
    }

    get averageDurationMs(): number
    {
        return this.totalDurationMs / this.samples.length;
    }

    get bytesPerSecond(): number
    {
        return this.totalTransferMs > 0 ? this.totalBytes / (this.totalTransferMs / 1000) : 0;
    }
}

export class DownloadSample
{
    readonly bytes: number;
    readonly durationMs: number;
    readonly transferMs: number;

    constructor(bytes: number, durationMs: number, transferMs: number)
    {
        this.bytes = bytes;
        this.durationMs = durationMs;
        this.transferMs = transferMs;
    }

    get bytesPerSecond(): number
    {
        return this.transferMs > 0 ? this.bytes / (this.transferMs / 1000) : 0;
    }
}

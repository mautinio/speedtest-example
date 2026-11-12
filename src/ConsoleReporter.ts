import type { DownloadSample } from "./DownloadSample.ts";
import { Messages } from "./Messages.ts";
import type { SpeedReport } from "./SpeedReport.ts";

const BITS_IN_BYTE = 8;
const BITS_IN_MEGABIT = 1_000_000;
const BYTES_IN_MEBIBYTE = 1024 * 1024;

export class ConsoleReporter
{
    printUsage(): void
    {
        console.error(Messages.usage());
        console.error(Messages.usageExample());
    }

    printStart(url: string, requestCount: number): void
    {
        console.log(Messages.target(url));
        console.log(Messages.requestCount(requestCount));
    }

    printSample(attempt: number, sample: DownloadSample): void
    {
        console.log(Messages.sample(
            String(attempt).padStart(2),
            this.milliseconds(sample.durationMs).padStart(9),
            this.megabytes(sample.bytes),
            this.megabitsPerSecond(sample.bytesPerSecond),
        ));
    }

    printReport(report: SpeedReport): void
    {
        console.log(Messages.summaryTitle());
        console.log(Messages.averageDuration(this.milliseconds(report.averageDurationMs)));
        console.log(Messages.totalDownloaded(this.megabytes(report.totalBytes), report.totalBytes));
        console.log(Messages.totalDuration(this.seconds(report.totalDurationMs)));
        console.log(Messages.totalTransfer(this.seconds(report.totalTransferMs)));
        console.log(Messages.downloadSpeed(
            this.megabitsPerSecond(report.bytesPerSecond),
            this.megabytesPerSecond(report.bytesPerSecond),
        ));
    }

    printError(error: unknown): void
    {
        console.error(Messages.error(error instanceof Error ? error.message : String(error)));
    }

    private milliseconds(durationMs: number): string
    {
        return Messages.milliseconds(durationMs.toFixed(0));
    }

    private seconds(durationMs: number): string
    {
        return Messages.seconds((durationMs / 1000).toFixed(2));
    }

    private megabytes(bytes: number): string
    {
        return Messages.megabytes((bytes / BYTES_IN_MEBIBYTE).toFixed(2));
    }

    private megabitsPerSecond(bytesPerSecond: number): string
    {
        return Messages.megabitsPerSecond(((bytesPerSecond * BITS_IN_BYTE) / BITS_IN_MEGABIT).toFixed(2));
    }

    private megabytesPerSecond(bytesPerSecond: number): string
    {
        return Messages.megabytesPerSecond((bytesPerSecond / BYTES_IN_MEBIBYTE).toFixed(2));
    }
}

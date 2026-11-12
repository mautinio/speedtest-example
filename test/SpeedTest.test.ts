import assert from "node:assert/strict";
import { test } from "node:test";
import type { Downloader } from "../src/Downloader.ts";
import { DownloadSample } from "../src/DownloadSample.ts";
import { SpeedTest } from "../src/SpeedTest.ts";

class FakeDownloader implements Downloader
{
    calls = 0;
    activeDownloads = 0;
    maxParallelDownloads = 0;

    async download(): Promise<DownloadSample>
    {
        this.calls++;
        this.activeDownloads++;
        this.maxParallelDownloads = Math.max(this.maxParallelDownloads, this.activeDownloads);
        await new Promise((resolve) => setImmediate(resolve));
        this.activeDownloads--;
        return new DownloadSample(1_000_000, 500, 400);
    }
}

class FailingDownloader implements Downloader
{
    calls = 0;

    async download(): Promise<DownloadSample>
    {
        this.calls++;
        throw new Error("HTTP 404");
    }
}

test("makes the requested number of downloads one at a time", async () =>
{
    const downloader = new FakeDownloader();
    const attempts: number[] = [];

    await new SpeedTest(downloader, 10).run("https://example.test/file", (attempt) => attempts.push(attempt));

    assert.equal(downloader.calls, 10);
    assert.equal(downloader.maxParallelDownloads, 1);
    assert.deepEqual(attempts, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("aggregates samples into a report", async () =>
{
    const report = await new SpeedTest(new FakeDownloader(), 10).run("https://example.test/file");

    assert.equal(report.totalBytes, 10_000_000);
    assert.equal(report.totalDurationMs, 5000);
    assert.equal(report.totalTransferMs, 4000);
    assert.equal(report.averageDurationMs, 500);
    assert.equal(report.bytesPerSecond, 2_500_000);
});

test("stops at the first failed download", async () =>
{
    const downloader = new FailingDownloader();

    await assert.rejects(new SpeedTest(downloader, 10).run("https://example.test/file"), { message: "HTTP 404" });
    assert.equal(downloader.calls, 1);
});

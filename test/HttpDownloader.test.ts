import assert from "node:assert/strict";
import { test } from "node:test";
import { HttpDownloader } from "../src/Downloader.ts";

test("counts every byte of the body and measures the duration", async () =>
{
    const downloader = new HttpDownloader(async () => new Response(new Uint8Array(2048)));

    const sample = await downloader.download("https://example.test/file");

    assert.equal(sample.bytes, 2048);
    assert.ok(sample.transferMs > 0);
    assert.ok(sample.durationMs >= sample.transferMs);
});

test("excludes the wait for the response from the transfer time", async () =>
{
    const downloader = new HttpDownloader(async () =>
    {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return new Response(new Uint8Array(2048));
    });

    const sample = await downloader.download("https://example.test/file");

    assert.ok(sample.durationMs - sample.transferMs >= 40);
});

test("asks the server for an uncompressed body", async () =>
{
    let requestedEncoding: string | null = null;
    const downloader = new HttpDownloader(async (_url, init) =>
    {
        requestedEncoding = new Headers(init?.headers).get("accept-encoding");
        return new Response(new Uint8Array(1));
    });

    await downloader.download("https://example.test/file");

    assert.equal(requestedEncoding, "identity");
});

test("rejects a non-2xx status", async () =>
{
    const downloader = new HttpDownloader(async () => new Response("", { status: 404, statusText: "Not Found" }));

    await assert.rejects(downloader.download("https://example.test/missing"), { message: "HTTP 404 Not Found" });
});

test("reports the underlying reason of a network failure", async () =>
{
    const downloader = new HttpDownloader(async () =>
    {
        throw new TypeError("fetch failed", { cause: new Error("getaddrinfo ENOTFOUND") });
    });

    await assert.rejects(downloader.download("https://nowhere.test"), { message: "getaddrinfo ENOTFOUND" });
});

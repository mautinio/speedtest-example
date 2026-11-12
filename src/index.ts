import { ConsoleReporter } from "./ConsoleReporter.ts";
import { HttpDownloader } from "./Downloader.ts";
import { SpeedTest } from "./SpeedTest.ts";

const REQUEST_COUNT = 10;

function isHttpUrl(text: string | undefined): text is string
{
    return text !== undefined && URL.canParse(text) && /^https?:$/.test(new URL(text).protocol);
}

const reporter = new ConsoleReporter();
const url = process.argv[2];

if (!isHttpUrl(url))
{
    reporter.printUsage();
    process.exit(1);
}

try
{
    reporter.printStart(url, REQUEST_COUNT);
    const speedTest = new SpeedTest(new HttpDownloader(), REQUEST_COUNT);
    const report = await speedTest.run(url, (attempt, sample) => reporter.printSample(attempt, sample));
    reporter.printReport(report);
}
catch (error)
{
    reporter.printError(error);
    process.exitCode = 1;
}

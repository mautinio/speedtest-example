export const Messages = {
    usage: () => "Использование: npm start -- <url>",
    usageExample: () => "Пример: npm start -- https://speed.cloudflare.com/__down?bytes=10000000",

    target: (url: string) => `Цель: ${url}`,
    requestCount: (count: number) => `Запросов: ${count} (последовательно)\n`,
    sample: (attempt: string, duration: string, size: string, speed: string) => `#${attempt}: ${duration}, ${size}, ${speed}`,

    summaryTitle: () => "\n--- Итоги ---",
    averageDuration: (duration: string) => `Среднее время запроса: ${duration}`,
    totalDownloaded: (size: string, bytes: number) => `Всего скачано:         ${size} (${bytes} байт)`,
    totalDuration: (duration: string) => `Общее время запросов:  ${duration}`,
    totalTransfer: (duration: string) => `Из них передача тела:  ${duration}`,
    downloadSpeed: (megabits: string, megabytes: string) => `Скорость скачивания:   ${megabits} (${megabytes})`,

    error: (reason: string) => `Ошибка: ${reason}`,

    milliseconds: (value: string) => `${value} мс`,
    seconds: (value: string) => `${value} с`,
    megabytes: (value: string) => `${value} МБ`,
    megabitsPerSecond: (value: string) => `${value} Мбит/с`,
    megabytesPerSecond: (value: string) => `${value} МБ/с`,
};

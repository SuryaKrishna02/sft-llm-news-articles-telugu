process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process with a non-zero status code
  });

export const LINKS_SCRAPER_INFO = [
    {
        "name": "sports",
        "base_url": "https://telugu.suryaa.com/breaking-sports-news-headlines.php?pagination=",
    },
    {
        "name": "technology",
        "base_url": "https://telugu.suryaa.com/latest-technology-news.php?pagination="
    }
];
export const LINKS_SCRAPER_TIMEOUT = [1, 2, 3] // In Seconds
export const generateOutputFilePath = (itemName) => `../data/links/${itemName}_links.txt`;
export const COMBINED_LINKS_FILE_NAME = "combined"

export const CONTENT_SCRAPER_MAJOR_TIMEOUT = [1*60, 2*60, 3*60] // In Seconds
export const CONTENT_SCRAPER_MINOR_TIMEOUT = [1, 5, 10] // In Seconds
export const CONTENT_SCRAPER_BATCH_SIZE = 10//200;
export const CONTENT_SCRAPER_MAJOR_TIMEOUT_LINKS = 40//50000;
export const generateOutputJsonPath = (batchIndex) => `../data/content/tmp/batch_${batchIndex}.json`
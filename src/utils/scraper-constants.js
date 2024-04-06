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
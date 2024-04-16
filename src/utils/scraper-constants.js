process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process with a non-zero status code
  });

export const RUN_LINKS_SCRAPER = true
export const LINKS_SCRAPER_INFO = [
    {
        "name": "ap",
        "base_url": "https://telugu.suryaa.com/andhrapradesh-latest.php?pagination="
    },
    {
        "name": "business",
        "base_url": "https://telugu.suryaa.com/business-news-stock-markets.php?pagination="

    },
    {
        "name": "devotion",
        "base_url": "https://telugu.suryaa.com/devotion-bhakthi.php?pagination="
    },
    {
        "name": "education",
        "base_url": "https://telugu.suryaa.com/education-and-career-news.php?pagination="
    },
    {
        "name": "health_beauty",
        "base_url": "https://telugu.suryaa.com/health-and-beauty-news.php?pagination="
    },
    {
        "name": "international",
        "base_url": "https://telugu.suryaa.com/international-news-in-telugu.php?pagination="
    },
    {
        "name": "life_style",
        "base_url": "https://telugu.suryaa.com/latest-life-style-news-updates.php?pagination="
    },
    {
        "name": "national",
        "base_url": "https://telugu.suryaa.com/national-news-in-telugu.php?pagination="
    },
    {
        "name": "sports",
        "base_url": "https://telugu.suryaa.com/breaking-sports-news-headlines.php?pagination=",
    },
    {
        "name": "technology",
        "base_url": "https://telugu.suryaa.com/latest-technology-news.php?pagination="
    },
    {
        "name": "telengana",
        "base_url": "https://telugu.suryaa.com/telangana-latest.php?pagination="
    }
];
export const LINKS_SCRAPER_TIMEOUT = [1, 2, 3] // In Seconds
export const generateOutputFilePath = (itemName) => `./src/data/links/${itemName}_links.txt`;
export const COMBINED_LINKS_FILE_NAME = "combined"

export const RUN_CONTENT_SCRAPER = true
export const CONTENT_SCRAPER_MAJOR_TIMEOUT = [1*60, 2*60, 3*60] // In Seconds
export const CONTENT_SCRAPER_MINOR_TIMEOUT = [1, 5, 10] // In Seconds
export const CONTENT_SCRAPER_BATCH_SIZE = 200;
export const CONTENT_SCRAPER_MAJOR_TIMEOUT_LINKS = 50000;
export const generateOutputJsonPath = (batchIndex) => `./src/data/content/tmp/batch_${batchIndex}.json`

export const SCRAPED_CONTENT_FILE_PATH = "./src/data/content/scraped_content.json"
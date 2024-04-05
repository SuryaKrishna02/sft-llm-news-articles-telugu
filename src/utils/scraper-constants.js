const LINKS_SCRAPER_INFO = [
    {
        "name": "telengana",
        "base_url": "https://telugu.suryaa.com/telangana-latest.php?pagination=",
    },
    {
        "name": "andhrapradesh",
        "base_url": "https://telugu.suryaa.com/andhrapradesh-latest.php?pagination="
    }
];
const LINKS_SCRAPER_MINOR_TIMEOUT = [1, 2, 3]
const LINKS_SCRAPER_MAJOR_TIMEOUT = [1*60, 2*60, 3*60]

module.exports = {
  LINKS_SCRAPER_INFO,
  LINKS_SCRAPER_MAJOR_TIMEOUT,
  LINKS_SCRAPER_MINOR_TIMEOUT
};

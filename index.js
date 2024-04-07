import linksScraper from './src/node/links-scraper.js'
import contentBatchScraper from './src/node/content-scraper.js'

linksScraper()
  .then(contentBatchScraper)
  .catch(error => {
    console.error('Error Occurred During Scraping:', error);
  });



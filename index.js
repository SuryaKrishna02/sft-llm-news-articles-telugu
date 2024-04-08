import linksScraper from './src/node/links-scraper.js'
import contentBatchScraper from './src/node/content-scraper.js'
import combineFiles from './src/node/combine-files.js'

linksScraper()
  .then(contentBatchScraper)
  .then(combineFiles)
  .catch(error => {
    console.error('Error Occurred During Scraping:', error);
  });
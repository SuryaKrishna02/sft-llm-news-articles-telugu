import linksScraper from './src/node/links-scraper.js'
import contentBatchScraper from './src/node/content-scraper.js'
import combineFiles from './src/node/combine-files.js'
import {
  RUN_CONTENT_SCRAPER,
  RUN_LINKS_SCRAPER
} from './src/utils/scraper-constants.js'

/**
 * Executes the links scraper, content scraper, and file combining functionality based on the configured settings.
 */
if (RUN_LINKS_SCRAPER && RUN_CONTENT_SCRAPER) {
  // Run both the links scraper and content scraper
  linksScraper()
    .then(contentBatchScraper)
    .then(combineFiles)
    .catch(error => {
      console.error('Error Occurred During Scraping:', error);
    });
} else if (RUN_LINKS_SCRAPER) {
  // Run only the links scraper
  linksScraper()
    .catch(error => {
      console.error('Error Occurred During Links Scraping:', error);
    });
} else if (RUN_CONTENT_SCRAPER) {
  // Run only the content scraper
  contentBatchScraper()
    .then(combineFiles)
    .catch(error => {
      console.error('Error Occurred During Content Scraping:', error);
    });
}
import linksScraper from './src/node/links-scraper.js'
import contentBatchScraper from './src/node/content-scraper.js'
import combineFiles from './src/node/combine-files.js'
import {
  RUN_CONTENT_SCRAPER,
  RUN_LINKS_SCRAPER
} from './src/utils/scraper-constants.js'

if (RUN_LINKS_SCRAPER && RUN_CONTENT_SCRAPER){
  linksScraper()
  .then(contentBatchScraper)
  .then(combineFiles)
  .catch(error => {
    console.error('Error Occurred During Scraping:', error);
  });
} else if(RUN_LINKS_SCRAPER){
  linksScraper()
  .catch(error => {
    console.error('Error Occurred During Links Scraping:', error);
  });
} else if(RUN_CONTENT_SCRAPER){
  contentBatchScraper()
  .then(combineFiles)
  .catch(error => {
    console.error('Error Occurred During Content Scraping:', error);
  });
} 

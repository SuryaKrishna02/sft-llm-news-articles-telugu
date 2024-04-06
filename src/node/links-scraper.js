import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { LINKS_SCRAPER_INFO , LINKS_SCRAPER_TIMEOUT, generateOutputFilePath} from '../../src/utils/scraper-constants.js';

async function timeout() {
    const randomSeconds = LINKS_SCRAPER_TIMEOUT; // Possible random timeout values in seconds
    const randomIndex = Math.floor(Math.random() * randomSeconds.length);
    const timeout = randomSeconds[randomIndex] * 1000 
    console.log(`Waiting for ${timeout/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, timeout));
  };

async function scrapePage(base_url, pageNumber, scrapedLinks) {
  const url = `${base_url}${pageNumber}`;
  console.log(`Scraping page ${pageNumber} - URL: ${url}`);
  try {
    const response = await axios.get(url);
    const html = response.data;
    const webpage = cheerio.load(html);
    
    const divElements = webpage('div.media-body');

    if (divElements.length === 0) {
        console.log('No more div elements found. Exiting.');
        return false;
      }
    
    divElements.each((_index, element) => {
      const links = webpage(element).find('a').map((i, a) => webpage(a).attr('href')).get();
      console.log('Links:', links);
      scrapedLinks.push(...links);
    });
    
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function startLinksScraping() {
    LINKS_SCRAPER_INFO.forEach(async item => {
        const BASE_URL = item.base_url;
        let page = 1;
        let continueScraping = true;
        let scrapedLinks = [];
        while (continueScraping) {
            continueScraping = await scrapePage(BASE_URL, page, scrapedLinks);
            page++;
            if (page == 3) break
            await timeout();
        }
        const outputFilePath = generateOutputFilePath(item.name);
        const outputDirectory = path.dirname(outputFilePath);
        try {
          await fs.access(outputDirectory);
        } catch (error) {
          // Directory doesn't exist, so create it
          await fs.mkdir(outputDirectory, { recursive: true });
        }
        
        try{
          await fs.writeFile(outputFilePath, scrapedLinks.join('\n'));
          console.log(`${scrapedLinks.length} Scraped links saved to ${outputFilePath}.`);
        } catch(err){
          console.error('Error writing to file:', err);
        }
    });

}

startLinksScraping();
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { 
  LINKS_SCRAPER_INFO , 
  LINKS_SCRAPER_TIMEOUT, 
  generateOutputFilePath,
  COMBINED_LINKS_FILE_NAME
} from '../../src/utils/scraper-constants.js';

async function timeout() {
    const randomSeconds = LINKS_SCRAPER_TIMEOUT; // Possible random timeout values in seconds
    const randomIndex = Math.floor(Math.random() * randomSeconds.length);
    const timeout = randomSeconds[randomIndex] * 1000 
    console.log(`Waiting for ${timeout/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, timeout));
  };

async function writeToFile(filePath, content){
  const outputDirectory = path.dirname(filePath);
  try {
    await fs.access(outputDirectory);
  } catch (error) {
    // Directory doesn't exist, so create it
    await fs.mkdir(outputDirectory, { recursive: true });
  }

  try{
    await fs.writeFile(filePath, content.join('\n'));
    console.log(`${content.length} Scraped links saved to ${filePath}.`);
  } catch(err){
    console.error('Error writing to file:', err);
  }
}

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
    let allLinks = []
    const promises = LINKS_SCRAPER_INFO.map(async (item) => {
      const BASE_URL = item.base_url;
      let page = 1;
      let continueScraping = true;
      let scrapedLinks = [];
  
      while (continueScraping) {
        continueScraping = await scrapePage(BASE_URL, page, scrapedLinks);
        page++;

        if (page == 3) break;         // Remove this piece of code after testing
        await timeout();
      }
  
      const outputFilePath = generateOutputFilePath(item.name);
      await writeToFile(outputFilePath, scrapedLinks);
      allLinks.push(...scrapedLinks);
    });
  
    await Promise.all(promises);
    
    const outputLinksFilePath = generateOutputFilePath(COMBINED_LINKS_FILE_NAME)
    await writeToFile(outputLinksFilePath, allLinks)
}

startLinksScraping();
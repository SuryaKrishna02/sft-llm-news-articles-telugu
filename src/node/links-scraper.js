import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import { LINKS_SCRAPER_INFO , LINKS_SCRAPER_MAJOR_TIMEOUT, LINKS_SCRAPER_MINOR_TIMEOUT} from '../utils/scraper-constants';


function getRandomMinorTimeout() {
    const randomSeconds = LINKS_SCRAPER_MINOR_TIMEOUT; // Possible random timeout values in seconds
    const randomIndex = Math.floor(Math.random() * randomSeconds.length);
    return randomSeconds[randomIndex] * 1000 // Convert to milliseconds
  }

function getRandomMajorTimeout() {
    const randomMinutes = LINKS_SCRAPER_MAJOR_TIMEOUT; // Possible random timeout values in minutes
    const randomIndex = Math.floor(Math.random() * randomMinutes.length);
    return randomMinutes[randomIndex] * 1000; // Convert to milliseconds
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

async function startScraping() {
    LINKS_SCRAPER_INFO.forEach(async item => {
        const BASE_URL = item.base_url;
        let page = 1;
        let continueScraping = true;
        let scrapedLinks = [];
        while (continueScraping) {
            continueScraping = await scrapePage(BASE_URL, page, scrapedLinks);
            page++;
            const minor_timeout = getRandomMinorTimeout()
            console.log(`Waiting for ${minor_timeout/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, minor_timeout));
            console.log('Resuming scraping...');
        }
        
        const outputFilePath = `../data/links/${item.name}_links.txt`;
        fs.writeFile(outputFilePath, scrapedLinks.join('\n'), (err) => {
            if (err) {
            console.error('Error writing to file:', err);
            } else {
            console.log(`Scraped links saved to ${outputFilePath}.`);
            }
        });

        const major_timeout = getRandomMajorTimeout()
        console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${major_timeout/(1000*60)} minutes...`);
        await new Promise(resolve => setTimeout(resolve, major_timeout)); 
        console.log('Resuming scraping...');
    });

}

startScraping();

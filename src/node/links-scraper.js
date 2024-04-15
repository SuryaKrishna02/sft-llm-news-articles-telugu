import path from 'path';
import axios from 'axios';
import fs from 'fs/promises';
import cheerio from 'cheerio';
import { 
  LINKS_SCRAPER_INFO , 
  LINKS_SCRAPER_TIMEOUT, 
  generateOutputFilePath,
  COMBINED_LINKS_FILE_NAME
} from '../../src/utils/scraper-constants.js';

/**
 * Applies a timeout delay to simulate a waiting period.
 *
 * @async
 * @function timeout
 * @returns {Promise<void>} - A Promise that resolves after the specified timeout.
 */
async function timeout() {
  // Retrieve a random timeout value from the LINKS_SCRAPER_TIMEOUT array
  const randomSeconds = LINKS_SCRAPER_TIMEOUT;
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  const timeout = randomSeconds[randomIndex] * 1000;

  // Log the waiting time
  console.log(`Waiting for ${timeout / 1000} seconds...`);

  // Apply the timeout delay using a Promise
  await new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Writes the scraped links to a file, creating the necessary directory if it doesn't exist.
 *
 * @async
 * @function writeToFile
 * @param {string} filePath - The full path of the file to be written.
 * @param {string[]} content - An array of strings representing the scraped links to be written to the file.
 * @returns {Promise<void>} - A Promise that resolves when the file write operation is complete.
 */
async function writeToFile(filePath, content) {
  // Retrieve the directory path from the file path
  const outputDirectory = path.dirname(filePath);

  try {
    // Check if the output directory exists
    await fs.access(outputDirectory);
  } catch (error) {
    // If the directory doesn't exist, create it
    await fs.mkdir(outputDirectory, { recursive: true });
  }

  try {
    // Write the content to the file
    await fs.writeFile(filePath, content.join('\n'));
    console.log(`${content.length} Scraped links saved to ${filePath}.`);
  } catch (err) {
    // Handle any errors that occurred during the file write operation
    console.error('Error writing to file:', err);
  }
}

/**
 * Scrapes a web page for links and adds them to the provided array.
 *
 * @async
 * @function scrapePage
 * @param {string} baseUrl - The base URL of the page to scrape.
 * @param {number} pageNumber - The page number to scrape.
 * @param {string[]} scrapedLinks - The array to store the scraped links.
 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the scraping was successful, `false` otherwise.
 */
async function scrapePage(baseUrl, pageNumber, scrapedLinks) {
  // Construct the URL for the current page
  const url = `${baseUrl}${pageNumber}`;
  console.log(`Scraping page ${pageNumber} - URL: ${url}`);

  try {
    // Fetch the HTML content of the page
    const response = await axios.get(url);
    const html = response.data;
    const webpage = cheerio.load(html);

    // Find the div elements containing the links
    const divElements = webpage('div.media-body');

    // If no div elements are found, exit the function
    if (divElements.length === 0) {
      console.log('No more div elements found. Exiting.');
      return false;
    }

    // Extract the links from the div elements and add them to the scrapedLinks array
    divElements.each((_index, element) => {
      const links = webpage(element).find('a').map((i, a) => webpage(a).attr('href')).get();
      console.log('Links:', links);
      scrapedLinks.push(...links);
    });

    // Indicate that the scraping was successful
    return true;
  } catch (error) {
    // Handle any errors that occurred during the scraping process
    console.error('Error:', error);
    return false;
  }
}

/**
 * Scrapes links from multiple web pages and writes the combined links to a file.
 *
 * @async
 * @function LinksScraper
 * @returns {Promise<void>} - A Promise that resolves when the scraping and file write operations are complete.
 */
export default async function LinksScraper() {
  // Initialize an array to store all the scraped links
  let allLinks = [];

  // Create an array of scraping promises for each item in the LINKS_SCRAPER_INFO array
  const promises = LINKS_SCRAPER_INFO.map(async (item) => {
    const BASE_URL = item.base_url;
    let page = 1;
    let continueScraping = true;
    let scrapedLinks = [];

    // Scrape links from each page until no more pages are available
    while (continueScraping) {
      continueScraping = await scrapePage(BASE_URL, page, scrapedLinks);
      page++;

      // Add a timeout after every 2 pages (for testing purposes)
      if (page === 3) break;
      await timeout();
    }

    // Write the scraped links to a file
    const outputFilePath = generateOutputFilePath(item.name);
    await writeToFile(outputFilePath, scrapedLinks);

    // Add the scraped links to the allLinks array
    allLinks.push(...scrapedLinks);
  });

  // Wait for all the scraping promises to complete
  await Promise.all(promises);

  // Write the combined links to a single output file
  const outputLinksFilePath = generateOutputFilePath(COMBINED_LINKS_FILE_NAME);
  await writeToFile(outputLinksFilePath, Array.from(new Set(allLinks)));
}
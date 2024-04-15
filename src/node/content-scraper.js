import path from 'path';
import axios from 'axios';
import fs from 'fs/promises';
import cheerio from 'cheerio';
import { 
  CONTENT_SCRAPER_MINOR_TIMEOUT , 
  CONTENT_SCRAPER_MAJOR_TIMEOUT, 
  generateOutputJsonPath,
  generateOutputFilePath,
  COMBINED_LINKS_FILE_NAME,
  CONTENT_SCRAPER_BATCH_SIZE,
  CONTENT_SCRAPER_MAJOR_TIMEOUT_LINKS
} from '../../src/utils/scraper-constants.js';

/**
 * Applies a major timeout delay to simulate a content scraping process.
 *
 * @async
 * @function majorTimeout
 * @param {number} totalProcessedUrls - The total number of URLs processed so far.
 * @returns {Promise<void>} - A Promise that resolves after the specified timeout.
 */
async function majorTimeout(totalProcessedUrls) {
  // Retrieve a random timeout value from the CONTENT_SCRAPER_MAJOR_TIMEOUT array
  const randomSeconds = CONTENT_SCRAPER_MAJOR_TIMEOUT;
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  const timeout = randomSeconds[randomIndex] * 1000;

  // Log the current number of processed URLs and the waiting time
  console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${timeout / (1000 * 60)} minutes...`);

  // Apply the major timeout delay using a Promise
  await new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Applies a minor timeout delay to simulate a content scraping process.
 *
 * @async
 * @function minorTimeout
 * @param {number} totalProcessedUrls - The total number of URLs processed so far.
 * @returns {Promise<void>} - A Promise that resolves after the specified timeout.
 */
async function minorTimeout(totalProcessedUrls) {
  // Retrieve a random timeout value from the CONTENT_SCRAPER_MINOR_TIMEOUT array
  const randomSeconds = CONTENT_SCRAPER_MINOR_TIMEOUT;
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  const timeout = randomSeconds[randomIndex] * 1000;

  // Log the current number of processed URLs and the waiting time
  console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${timeout / 1000} seconds...`);

  // Apply the minor timeout delay using a Promise
  await new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Scrapes the content from a website and returns the extracted data.
 *
 * @async
 * @function scrapeWebsite
 * @param {string} url - The URL of the website to be scraped.
 * @returns {Promise<{
*   url: string,
*   title: string,
*   content: string,
*   status: string,
*   error_msg: string,
*   total_title_char: number | null,
*   total_content_char: number | null,
*   total_title_words: number | null,
*   total_content_words: number | null
* }>} - An object containing the scraped data or error information.
*/
async function scrapeWebsite(url) {
 try {
   // Fetch the website content
   const response = await axios.get(url);
   const html = response.data;
   const webpage = cheerio.load(html);

   // Extract the target div and its content
   const targetDiv = webpage('.col-lg-12.col-md-12');
   const title = targetDiv.find('h1').text().trim();
   const content = targetDiv.find('.col-md-12').find('span').text().trim();

   // Calculate the character and word counts
   const totalTitleChar = title.length;
   const totalContentChar = content.length;
   const totalTitleWords = title.split(/\s+/).length;
   const totalContentWords = content.split(/\s+/).length;

   // Return the scraped data
   return {
     url,
     title,
     content,
     status: "Success",
     error_msg: "",
     total_title_char: totalTitleChar,
     total_content_char: totalContentChar,
     total_title_words: totalTitleWords,
     total_content_words: totalContentWords
   };
 } catch (error) {
   // Handle any errors that occurred during the scraping process
   console.error('Error:', error);
   return {
     url,
     title: "",
     content: "",
     status: "Failure",
     error_msg: error.message,
     total_title_char: null,
     total_content_char: null,
     total_title_words: null,
     total_content_words: null
   };
 }
}

/**
 * Writes the provided data to a JSON file.
 *
 * @async
 * @function writeToJson
 * @param {object} data - The data to be written to the JSON file.
 * @param {number} batchIndex - The index of the current batch, used to generate the output file path.
 * @returns {Promise<void>} - A Promise that resolves when the file write operation is complete.
 */
async function writeToJson(data, batchIndex) {
  // Generate the output file path based on the batch index
  const jsonFilePath = generateOutputJsonPath(batchIndex);

  try {
    // Write the data to the JSON file
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data for batch ${batchIndex} written to ${jsonFilePath}`);
  } catch (error) {
    // Handle any errors that occurred during the file write operation
    console.error('Error writing to JSON:', error);
  }
}

/**
 * Scrapes the content from a batch of website URLs and writes the data to a JSON file.
 *
 * @async
 * @function scrapeAndWriteToJsonBatch
 * @param {string[]} urls - An array of website URLs to scrape.
 * @param {number} batchIndex - The index of the current batch, used to generate the output file path.
 * @returns {Promise<void>} - A Promise that resolves when the scraping and file write operations are complete.
 */
async function scrapeAndWriteToJsonBatch(urls, batchIndex) {
  try {
    // Scrape the content from the provided URLs
    const scrapingPromises = urls.map(url => scrapeWebsite(url));
    const scrapedData = await Promise.all(scrapingPromises);

    // Write the scraped data to a JSON file
    await writeToJson(scrapedData, batchIndex);
  } catch (error) {
    // Handle any errors that occurred during the scraping or file write operations
    console.error(`Failed to scrape and write for batch ${batchIndex}:`, error);
  }
}

/**
 * Extracts a list of links from a file.
 *
 * @async
 * @function extractLinksFromFile
 * @param {string} filePath - The path to the file containing the links.
 * @returns {Promise<string[]>} - An array of extracted links, or an empty array in case of an error.
 */
async function extractLinksFromFile(filePath) {
  try {
    // Read the contents of the file
    const data = await fs.readFile(filePath, { encoding: 'utf8' });

    // Split the data into individual links and trim each link
    const links = data.split('\n').map(link => link.trim());

    // Return the array of extracted links
    return links;
  } catch (error) {
    // Handle any errors that occurred during the file read operation
    console.error(error);
    return [];
  }
}

/**
 * Scrapes content from a batch of website URLs and writes the data to JSON files.
 *
 * @async
 * @function contentBatchScraper
 * @returns {Promise<void>} - A Promise that resolves when the scraping and file write operations are complete.
 */
export default async function contentBatchScraper() {
  // Retrieve the batch size and the file path for the combined links
  const batchSize = CONTENT_SCRAPER_BATCH_SIZE;
  const LINKS_FILE_PATH = generateOutputFilePath(COMBINED_LINKS_FILE_NAME);

  // Extract the website URLs from the links file
  const websiteURLs = await extractLinksFromFile(LINKS_FILE_PATH);
  console.log(`Extracted URLs: ${websiteURLs.length}`);

  // Ensure the output directory exists, create it if necessary
  const outputDirectory = path.dirname(generateOutputJsonPath(0));
  try {
    await fs.access(outputDirectory);
  } catch (error) {
    await fs.mkdir(outputDirectory, { recursive: true });
  }

  let totalProcessedUrls = 0;

  // Process the URLs in batches
  for (let i = 0; i < websiteURLs.length; i += batchSize) {
    const batchUrls = websiteURLs.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize) + 1; // 1-indexed batch number

    // Scrape the content and write the data to a JSON file
    await scrapeAndWriteToJsonBatch(batchUrls, batchIndex);

    // Update the total number of processed URLs
    totalProcessedUrls += batchUrls.length;

    // Check if all URLs have been processed
    if (totalProcessedUrls >= websiteURLs.length) {
      console.log('Done scraping...');
      break;
    }

    // Apply a major or minor timeout delay based on the number of processed URLs
    if ((totalProcessedUrls % CONTENT_SCRAPER_MAJOR_TIMEOUT_LINKS) === 0) {
      await majorTimeout(totalProcessedUrls);
    } else {
      await minorTimeout(totalProcessedUrls);
    }
  }
}
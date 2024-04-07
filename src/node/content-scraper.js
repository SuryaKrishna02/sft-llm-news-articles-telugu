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

async function majorTimeout(totalProcessedUrls) {
  const randomSeconds = CONTENT_SCRAPER_MAJOR_TIMEOUT; // Possible random timeout values in seconds
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  const timeout = randomSeconds[randomIndex] * 1000 
  console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${timeout/(1000*60)} minutes...`);
  await new Promise(resolve => setTimeout(resolve, timeout));
};

async function minorTimeout(totalProcessedUrls) {
  const randomSeconds = CONTENT_SCRAPER_MINOR_TIMEOUT; // Possible random timeout values in seconds
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  const timeout = randomSeconds[randomIndex] * 1000 
  console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${timeout/1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, timeout));
};

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const webpage = cheerio.load(html);

    const targetDiv = webpage('.col-lg-12.col-md-12');
    const title = targetDiv.find('h1').text().trim();
    const content = targetDiv.find('.col-md-12').find('span').text().trim();
    const totalTitleChar = title.length;
    const totalContentChar = content.length;
    const totalTitleWords = title.split(/\s+/).length;
    const totalContentWords = content.split(/\s+/).length;

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

async function writeToJson(data, batchIndex) {
  const jsonFilePath = generateOutputJsonPath(batchIndex)
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data for batch ${batchIndex} written to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error writing to JSON:', error);
  }
}

async function scrapeAndWriteToJsonBatch(urls, batchIndex) {
  try {
    const scrapingPromises = urls.map(url => scrapeWebsite(url));
    const scrapedData = await Promise.all(scrapingPromises);

    // Write data to JSON
    await writeToJson(scrapedData, batchIndex);

  } catch (error) {
    console.error(`Failed to scrape and write for batch ${batchIndex}:`, error);
  }
}

async function extractLinksFromFile(filePath) {
    try {
      const data = await fs.readFile(filePath, { encoding: 'utf8' });
      const links = data.split('\n').map(link => link.trim());
      return links;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

export default async function contentBatchScraper(){
  const batchSize = CONTENT_SCRAPER_BATCH_SIZE
  const LINKS_FILE_PATH = generateOutputFilePath(COMBINED_LINKS_FILE_NAME)
  const websiteURLs = await extractLinksFromFile(LINKS_FILE_PATH);
  console.log(`Extracted URLs: ${websiteURLs.length}`);

  const outputDirectory = path.dirname(generateOutputJsonPath(0));
  try {
    await fs.access(outputDirectory);
  } catch (error) {
    // Directory doesn't exist, so create it
    await fs.mkdir(outputDirectory, { recursive: true });
  }

  let totalProcessedUrls = 0;
  // Process URLs in batches
  for (let i = 0; i < websiteURLs.length; i += batchSize) {
    const batchUrls = websiteURLs.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize) + 1; // 1-indexed batch number

    await scrapeAndWriteToJsonBatch(batchUrls, batchIndex);

    // Update the total processed URLs count
    totalProcessedUrls += batchUrls.length;

    if(totalProcessedUrls >= websiteURLs.length) {
      console.log('Done scraping...')
      break;
    }

    if ((totalProcessedUrls % CONTENT_SCRAPER_MAJOR_TIMEOUT_LINKS) == 0) {
        await majorTimeout(totalProcessedUrls)
    } else {
        await minorTimeout(totalProcessedUrls)
    }   
  }
}
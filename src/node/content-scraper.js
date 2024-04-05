import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';

const BATCH_SIZE = 200;
const LINKS_FILE_PATH = 'empty_title_content_4.txt';
const MAJOR_TIMEOUT_LINKS = 50000;

function getRandomMinorTimeout() {
  const randomSeconds = [5, 5]; // Possible random timeout values in seconds
  const randomIndex = Math.floor(Math.random() * randomSeconds.length);
  return randomSeconds[randomIndex] * 1000 // Convert to milliseconds
}

function getRandomMajorTimeout() {
  const randomMinutes = [3*60, 3*60]; // Possible random timeout values in minutes
  const randomIndex = Math.floor(Math.random() * randomMinutes.length);
  return randomMinutes[randomIndex] * 1000; // Convert to milliseconds
}

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
  const jsonFilePath = `empty_title_content_4/batch_${batchIndex}.json`;

  try {
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
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

function extractLinksFromFile(filePath) {
  try {
    // Read the file synchronously (you can also read it asynchronously if needed)
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Split the file content by lines to get an array of URLs
    const links = fileContent.split('\n').map(link => link.trim()).filter(Boolean);

    return links;
  } catch (error) {
    console.error('Error reading the file:', error);
    return [];
  }
}

const websiteURLs = extractLinksFromFile(LINKS_FILE_PATH);
console.log(`Extracted URLs: ${websiteURLs.length}`);
let totalProcessedUrls = 0;

async function processBatches(){
  // Process URLs in batches
  for (let i = 0; i < websiteURLs.length; i += BATCH_SIZE) {
    const batchUrls = websiteURLs.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1; // 1-indexed batch number

    await scrapeAndWriteToJsonBatch(batchUrls, batchIndex);

    // Update the total processed URLs count
    totalProcessedUrls += batchUrls.length;

    if(totalProcessedUrls >= websiteURLs.length) {
      console.log('Done scraping...')
      break;
    }

    if ((totalProcessedUrls % MAJOR_TIMEOUT_LINKS) == 0) {
      const major_timeout = getRandomMajorTimeout()
      console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${major_timeout/(1000*60)} minutes...`);
      await new Promise(resolve => setTimeout(resolve, major_timeout)); 
      console.log('Resuming scraping...');
    } else {
      const minor_timeout = getRandomMinorTimeout()
      console.log(`Processed ${totalProcessedUrls} URLs. Waiting for ${minor_timeout/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, minor_timeout));
      console.log('Resuming scraping...');
    }
    
  }
}

processBatches().catch(error => console.error('Error processing batches:', error));
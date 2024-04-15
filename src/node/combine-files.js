import fs from 'fs'
import path from 'path'
import { 
  generateOutputJsonPath,
  SCRAPED_CONTENT_FILE_PATH
} from '../../src/utils/scraper-constants.js';


/**
 * Combines all JSON files in a directory and writes the combined data to a single output file.
 *
 * @function combineFiles
 * @returns {void}
 */
export default function combineFiles() {
  // Retrieve the directory path where the JSON files are located
  let directoryPath = path.dirname(generateOutputJsonPath(0));

  // Specify the file path where the combined data will be written
  let outputFilePath = SCRAPED_CONTENT_FILE_PATH;

  // Create an empty object to store the combined data
  let combinedData = {};

  // Read all files in the directory and merge the JSON data
  fs.readdirSync(directoryPath).forEach(file => {
    if (path.extname(file).toLowerCase() === '.json') {
      const filePath = path.join(directoryPath, file);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      combinedData = { ...combinedData, ...fileData };
    }
  });

  // Write the combined data to the output file
  fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2));

  // Log a success message
  console.log('JSON files combined successfully!');
}
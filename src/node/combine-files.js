import fs from 'fs'
import path from 'path'
import { 
  generateOutputJsonPath,
  SCRAPED_CONTENT_FILE_PATH
} from '../../src/utils/scraper-constants.js';


export default function combineFiles() {
    let directoryPath = path.dirname(generateOutputJsonPath(0))
    let outputFilePath = SCRAPED_CONTENT_FILE_PATH

    // Create an empty object to store the combined data
    let combinedData = {};
  
    // Read all files in the directory
    fs.readdirSync(directoryPath).forEach(file => {
      // Check if the file is a JSON file
      if (path.extname(file).toLowerCase() === '.json') {
        // Read the JSON file
        const filePath = path.join(directoryPath, file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
        // Merge the file data into the combined data
        combinedData = { ...combinedData, ...fileData };
      }
    });
  
    // Write the combined data to a new JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2));
  
    console.log('JSON files combined successfully!');
}
  
import { promises as fs } from 'fs';
import path from 'path';

async function incrementBuildNumber(filePath) {
  try {
    // Read the file
    let fileContent = await fs.readFile(filePath, 'utf8');

    // Regular expression to find the build number pattern
    const buildNumberRegex = /build:\s*'\.a(\d+)'/;

    // Replace the build number
    fileContent = fileContent.replace(buildNumberRegex, (match, number) => {
      // Increment the number
      const incrementedNumber = parseInt(number, 10) + 1;
      console.log('Incremented build number to:', incrementedNumber);
      // Return the replaced string
      return `build: '.a${incrementedNumber}'`;
    });

    // Write the file back
    await fs.writeFile(filePath, fileContent);
    console.log('Build number incremented.');
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

// Adjust the path as needed
const filePath = path.join('src', 'Mini', 'index.tsx');
incrementBuildNumber(filePath);

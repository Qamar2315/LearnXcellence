// Import the 'fs' module for file system operations
const fs = require("fs");

/**
 * Converts an image file to a Base64 encoded string.
 *
 * This function reads the image file from the provided file path, converts its binary data to a Base64
 * encoded string, and returns it as a Data URL in the format:
 * `data:image/jpeg;base64,....`.
 *
 * @param {string} imagePath - The path to the image file that needs to be converted.
 * @returns {string} A Data URL string containing the Base64 encoded image.
 */
const base64Image = (imagePath) => {
  try {
    const image = fs.readFileSync(imagePath);
    return `data:image/jpeg;base64,${image.toString("base64")}`;
  } catch (error) {
    console.error(`Error reading image ${imagePath}:`, error);
    return ""; // Return an empty string if the image can't be read
  }
};

module.exports = {
  base64Image,
};

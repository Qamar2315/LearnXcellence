const fs = require("fs");

/**
 * Deletes a file at the specified file path if it exists.
 *
 * @param {string} filePath - The path to the file to be deleted.
 */
const deleteFileByPath = (filePath) => {
  // Check if the file exists at the given path
  if (fs.existsSync(filePath)) {
    // Attempt to delete the file asynchronously
    fs.unlink(filePath, (err) => {
      if (err) {
        // If an error occurs during deletion, throw the error
        throw err;
      }
    });
  }
};

module.exports = { deleteFileByPath };

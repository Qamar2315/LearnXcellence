const fs = require("fs");
const path = require("path");

/**
 * Deletes a file from the "profile_pictures" directory in the public folder.
 *
 * @param {string} fileName - The name of the file to be deleted.
 */
const deleteFile = (fileName) => {
  // Construct the full file path using the provided file name
  const filePath = path.join(__dirname, "..", "public", "profile_pictures", fileName);

  // Attempt to delete the file asynchronously
  fs.unlink(filePath, (err) => {
    if (err) {
      // If an error occurs during deletion, throw the error to be handled by the caller
      throw err;
    }
  });
};

module.exports = { deleteFile };

const fs = require("fs");

const deleteFileByPath = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

module.exports = { deleteFileByPath };

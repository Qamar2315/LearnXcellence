const fs = require("fs");

const deleteFileByPath = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
  
};

module.exports = { deleteFileByPath };

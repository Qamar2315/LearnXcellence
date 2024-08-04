const fs = require("fs");
const path = require("path");

const deleteFile = (fileName) => {
  const filePath = path.join(__dirname, "..", "public","profile_pictures", fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
  
};

module.exports = { deleteFile };

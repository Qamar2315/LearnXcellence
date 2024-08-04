const multer = require("multer");
const path = require("path");
const fs = require("fs");

const proctor_images_dataDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "proctor_images_data"
);

if (!fs.existsSync(proctor_images_dataDir)) {
  fs.mkdirSync(proctor_images_dataDir, { recursive: true });
}

const proctoringImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, proctor_images_dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const proctoringImageStorageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
  }
};

const uploadProctoringImage = multer({
  storage: proctoringImageStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: proctoringImageStorageFilter,
});

module.exports = {
  uploadProctoringImage,
};

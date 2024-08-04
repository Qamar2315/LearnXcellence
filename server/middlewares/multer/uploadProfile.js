const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profilePicturesDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "profile_pictures"
);

if (!fs.existsSync(profilePicturesDir)) {
  fs.mkdirSync(profilePicturesDir, { recursive: true });
}

// Configuration for logo uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicturesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const profileStorageFilter = (req, file, cb) => {
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

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: profileStorageFilter,
});

module.exports = { uploadProfile };

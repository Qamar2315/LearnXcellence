const multer = require("multer");
const path = require("path");
const fs = require("fs");

const lectureDataDir = path.join(__dirname, "..", "..", "uploads", "lectures");

if (!fs.existsSync(lectureDataDir)) {
  fs.mkdirSync(lectureDataDir, { recursive: true });
}

const lectureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, lectureDataDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const lectureStorageFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only video files are allowed (mp4, avi, mkv)"));
  }
};

const uploadLecture = multer({
  storage: lectureStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
  fileFilter: lectureStorageFilter,
});

module.exports = {
  uploadLecture,
};

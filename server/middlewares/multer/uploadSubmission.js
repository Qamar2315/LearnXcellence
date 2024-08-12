const multer = require("multer");
const path = require("path");
const fs = require("fs");

const submission_dataDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "submissions"
);

if (!fs.existsSync(submission_dataDir)) {
  fs.mkdirSync(submission_dataDir, { recursive: true });
}

const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submission_dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const submissionStorageFilter = (req, file, cb) => {
  const allowedTypes = /doc|docx|pdf/;
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

const uploadSubmission = multer({
    storage: submissionStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: submissionStorageFilter,
});

module.exports = {
    uploadSubmission,
};

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const assignment_dataDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "assignments"
);

if (!fs.existsSync(assignment_dataDir)) {
  fs.mkdirSync(assignment_dataDir, { recursive: true });
}

const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assignment_dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const assignmentStorageFilter = (req, file, cb) => {
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

const uploadAssignment = multer({
    storage: assignmentStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: assignmentStorageFilter,
});

module.exports = {
    uploadAssignment,
};

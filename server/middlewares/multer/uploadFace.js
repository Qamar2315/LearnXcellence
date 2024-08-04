const multer = require("multer");
const path = require("path");
const fs = require("fs");

const face_images_dataDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "face_biometric_data"
);

if (!fs.existsSync(face_images_dataDir)) {
  fs.mkdirSync(face_images_dataDir, { recursive: true });
}

const faceBiometricDataStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, face_images_dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const faceBiometricDataStorageFilter = (req, file, cb) => {
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

const uploadFaceBiometricData = multer({
  storage: faceBiometricDataStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: faceBiometricDataStorageFilter,
});

module.exports = {
  uploadFaceBiometricData,
};

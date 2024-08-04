const asyncHandler = require("../utilities/CatchAsync");
const axios = require("axios");
const AppError = require("../utilities/AppError");
const proctoringService = require("../services/proctoringService");

const analyzeImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }
  const studentId = req.user._id; // Assuming you have middleware to authenticate and set req.user
  const imagePath = req.file.path; // Path of the uploaded image

  const result = await proctoringService.analyzeImage(studentId, imagePath);
  res.status(200).json(result);
});

module.exports = {
  analyzeImage,
};

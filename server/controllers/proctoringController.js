const asyncHandler = require("../utilities/CatchAsync");
const axios = require("axios");
const AppError = require("../utilities/AppError");
const proctoringService = require("../services/proctoringService");

const analyzeImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }
  
  const studentId = req.user._id; // Get the student ID from the authenticated user
  const quizId = req.params.quizId; // Get the quiz ID from the route parameters
  const imagePath = req.file.path; // Path of the uploaded image

  // Check if the quiz submission exists and is within the allowed time frame
  const result = await proctoringService.analyzeImage(studentId, quizId, imagePath);
  
  res.status(200).json(result);
});


module.exports = {
  analyzeImage,
};

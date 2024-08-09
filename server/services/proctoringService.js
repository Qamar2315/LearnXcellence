const axios = require("axios");
const proctoringReportRepository= require("../repositories/proctoringReportRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const AppError = require("../utilities/AppError");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const path = require("path");

const analyzeImage = async (studentId, quizId, imagePath) => {
  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  if (!submission) {
    throw new AppError("No submission found quiz not started yet", 404);
  }

  if (submission.isCompleted) {
    throw new AppError("Quiz has already been completed", 400);
  }

  const currentTime = new Date();
  const timeRemaining = submission.endTime - currentTime;

  // Check if at least 40 seconds remain before the quiz ends
  if (timeRemaining < 40000) {
    throw new AppError("Cannot take image, quiz about to end", 400);
  }

  // Call Flask API to analyze the image
  const response = await axios.post(`${process.env.FLASK_URL}/analyze-image`, {
    image_path: imagePath,
  });

  if (!response.data.success) {
    throw new AppError(response.data.error, 400);
  }

  // Append the proctoring image to the submission's proctoring report
  const updatedReport = await proctoringReportRepository.updateProctoringReport(
    submission.proctoringReport,
    {
      imageId: "result_" + path.basename(imagePath),
      cheatingIndicators: response.data.data,
    }
  );

  deleteFileByPath(imagePath);

  return {
    success: true,
    message: "Image analyzed successfully",
    updatedReport,
  };
};

module.exports = {
  analyzeImage,
};

module.exports = {
  analyzeImage,
};

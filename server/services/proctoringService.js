const axios = require("axios");
const proctoringRepository = require("../repositories/proctoringRepository");
const AppError = require("../utilities/AppError");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const path = require("path");

const analyzeImage = async (studentId, imagePath) => {
  // Call Flask API to analyze image
  const response = await axios.post(`${process.env.FLASK_URL}/analyze-image`, {
    image_path: imagePath,
  });
  if (!response.data.success) {
    throw new AppError(response.data.error, 400);
  }

  console.log(response.data);
  await proctoringRepository.createProtoringImage(
    "result_" + path.basename(imagePath),
    response.data
  );

  deleteFileByPath(imagePath);

  return {
    success: true,
    message: "Image analyzed successfully",
  };
};

module.exports = {
  analyzeImage,
};

const express = require("express");
const router = express.Router();

// Middleware for user authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const { isStudent, isTeacher, isCourseCreator } = require("../middlewares/authorization");

// Middleware for handling file uploads (specifically for proctoring images)
const { uploadProctoringImage } = require("../middlewares/multer/uploadProctoringImage");

// Controller for handling proctoring-related logic
const proctoringController = require("../controllers/proctoringController");

// --- Proctoring Routes ---

// Route for analyzing proctoring images during a quiz
router
  .route("/:courseId/:quizId/analyze-image")
  .post(
    isLogin,                              // Ensure the user is logged in
    isEmailVerified,                      // Ensure the user's email is verified
    isStudent,                            // Ensure the user is a student
    uploadProctoringImage.single("proctor_image"), // Middleware to handle single image upload
    proctoringController.analyzeImage     // Controller function to analyze the uploaded image
  );

// Route for generating a proctoring report for a specific student in a quiz
router
  .route("/:courseId/:quizId/generate-report/:studentId")
  .get(
    isLogin,                              // Ensure the user is logged in
    isEmailVerified,                      // Ensure the user's email is verified
    isTeacher,                            // Ensure the user is a teacher
    isCourseCreator,                      // Ensure the user is a course creator
    proctoringController.generateReport   // Controller function to generate a proctoring report
  );

module.exports = router;

const express = require("express");
const router = express.Router();

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isStudent,
  isTeacher,
  isCourseCreator,
} = require("../middlewares/authorization");
const {
  uploadProctoringImage,
} = require("../middlewares/multer/uploadProctoringImage");

// Controller
const proctoringController = require("../controllers/proctoringController");

// --- Proctoring Routes ---

/**
 * @route  POST /api/proctoring/:courseId/:quizId/analyze-image
 * @desc   Analyze a proctoring image during a quiz
 * @access Private (Student Only)
 */
router.post(
  "/:courseId/:quizId/analyze-image",
  isLogin,
  isEmailVerified,
  isStudent,
  uploadProctoringImage.single("proctor_image"),
  proctoringController.analyzeImage
);

/**
 * @route  GET /api/proctoring/:courseId/:quizId/generate-report/:studentId
 * @desc   Generate a proctoring report for a student
 * @access Private (Teacher and Course Creator only)
 */
router
  .route("/:courseId/:quizId/generate-report/:studentId")
  .get(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    proctoringController.generateReport
  );

module.exports = router;

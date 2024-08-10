const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const {
  isStudent,
  isTeacher,
  isCourseCreator,
} = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  uploadProctoringImage,
} = require("../middlewares/multer/uploadProctoringImage");
const proctoringController = require("../controllers/proctoringController");
router
  .route("/:courseId/:quizId/analyze-image")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    uploadProctoringImage.single("proctor_image"),
    proctoringController.analyzeImage
  );

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

const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { isLogin } = require("../middlewares/isLogin");
const {
  isStudent,
  isTeacher,
  isCourseCreator,
  isCourseStudent,
} = require("../middlewares/authorization");
const { validateSubmission } = require("../middlewares/schemaValidator");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { uploadSubmission } = require("../middlewares/multer/uploadSubmission");

router
  .route("/:courseId/submission/:submissionId/download")
  .get(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    submissionController.downloadSubmissionTeacher
  );

router
  .route("/:courseId/assignment/:assignmentId")
  .get(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    submissionController.getSubmissions
  )
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    uploadSubmission.single("submision_document"),
    submissionController.createSubmission
  );

router
  .route("/assignment/:assignmentId/submissions/:submissionId/download")
  .get(
    isLogin,
    isEmailVerified,
    isStudent,
    submissionController.downloadSubmission
  );

router
  .route("/assignment/:assignmentId/submissions/:submissionId")
  .get(isLogin, isEmailVerified, isStudent, submissionController.getSubmission)
  .put(
    isLogin,
    isEmailVerified,
    isStudent,
    uploadSubmission.single("submision_document"),
    submissionController.updateSubmission
  )
  .delete(isLogin, isStudent, submissionController.deleteSubmission);

module.exports = router;

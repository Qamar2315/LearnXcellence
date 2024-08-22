const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { validateRemark } = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isCourseCreator,
  isStudent,
  isProjectGroupMember,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const remarkController = require("../controllers/remarkController");

router
  .route("/viva/:courseId/:projectId/add")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.addRemarkToViva
  );

router
  .route("/viva/:courseId/:projectId/:remarkId")
  .get(isLogin,isEmailVerified, isStudent, isProjectGroupMember, remarkController.sendRemark)
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.updateRemark
  );

// Add remark to a submission
router
  .route("/submission/:courseId/:submissionId/add")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.addRemarkToSubmission
  );

// Get, update remark on a submission
router
  .route("/submission/:courseId/:submissionId/:remarkId")
  .get(isLogin, isStudent,isCourseCreatorOrCourseStudent, remarkController.readSubmissionRemark)
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.updateSubmissionRemark
  );

module.exports = router;

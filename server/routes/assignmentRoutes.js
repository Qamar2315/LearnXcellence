const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { uploadAssignment } = require("../middlewares/multer/uploadAssignment");
const { isCourseCreator, isTeacher } = require("../middlewares/authorization");
const { isLogin } = require("../middlewares/isLogin");
const { validateAssignment } = require("../middlewares/schemaValidator");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

router
  .route("/:courseId")
  .get(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    assignmentController.getAssignments
  )
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    uploadAssignment.single("assignment_document"),
    assignmentController.createAssignment
  );

router
  .route("/:courseId/assignment/:assignmentId/download")
  .get(isLogin, isEmailVerified, assignmentController.downloadAssignment);

router
  .route("/:courseId/assignment/:assignmentId")
  .get(isLogin, isEmailVerified, assignmentController.getAssignment)
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    uploadAssignment.single("assignment_document"),
    assignmentController.updateAssignment
  )
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    assignmentController.deleteAssignment
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateStatus } = require("../middlewares/schemaValidator");
const { isTeacher, isCourseCreator, isCourseCreatorOrCourseStudent } = require("../middlewares/authorization");

const statusController = require("../controllers/statusController");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,
    isTeacher,
    isEmailVerified,
    isCourseCreator,
    validateStatus,
    statusController.addStatus
  );

router
  .route("/:courseId/:projectId/:statusId")
  .get(isLogin,isEmailVerified,isCourseCreatorOrCourseStudent, statusController.sendStatus)
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateStatus,
    statusController.updateStatus
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateStatus } = require("../middlewares/schemaValidator");
const { isTeacher, isCourseCreator } = require("../middlewares/authorization");

const statusController = require("../controllers/statusController");

router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateStatus,
    statusController.addStatus
  );

router
  .route("/:courseId/:projectId/:statusId")
  .get(isLogin, statusController.sendStatus)
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateStatus,
    statusController.updateStatus
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateRemark } = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isCourseCreator,
  isStudent,
  isProjectGroupMember,
} = require("../middlewares/authorization");
const remarkController = require("../controllers/remarkController");

router
  .route("/:courseId/:projectId/remarks")
  .post(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.addRemark
  );

router
  .route("/:courseId/:projectId/:remarkId")
  .get(isLogin, isStudent, isProjectGroupMember, remarkController.sendRemark)
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateRemark,
    remarkController.updateRemark
  );

module.exports = router;

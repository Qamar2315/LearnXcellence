const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateProject } = require("../middlewares/schemaValidator");
const {
  isStudent,
  isCourseStudent,
  isProjectCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const projectController = require("../controllers/projectController");

router
  .route("/create")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    validateProject,
    projectController.createProject
  );

router
  .route("/:courseId/:projectId/add-member")
  .put(
    isLogin,
    isEmailVerified,
    isCourseStudent,
    isProjectCreator,
    projectController.addMember
  );

router
  .route("/:courseId/:projectId/:memberId/remove-member")
  .put(
    isLogin,
    isEmailVerified,
    isCourseStudent,
    isProjectCreator,
    projectController.removeMember
  );

router
  .route("/:courseId/generate-project-suggestions")
  .get(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    projectController.generateProjectSuggestions
  );

router
  .route("/:courseId/:projectId")
  .get(
    isLogin,
    isEmailVerified,
    isCourseCreatorOrCourseStudent,
    projectController.sendProject
  )
  .put(
    isLogin,
    isEmailVerified,
    isStudent,
    isProjectCreator,
    validateProject,
    projectController.updateProject
  )
  .delete(
    isLogin,
    isEmailVerified,
    isCourseCreatorOrCourseStudent,
    projectController.deleteProject
  );

module.exports = router;

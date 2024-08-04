const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateProject } = require("../middlewares/schemaValidator");
const {
  isStudent,
  isCourseStudent,
  isProjectCreator,
} = require("../middlewares/authorization");

const projectController = require("../controllers/projectController");

router
  .route("/create")
  .post(
    isLogin,
    isStudent,
    validateProject,
    isCourseStudent,
    projectController.createProject
  );

router
  .route("/:projectId")
  .get(isLogin, projectController.sendProject)
  .put(
    isLogin,
    isStudent,
    isProjectCreator,
    validateProject,
    projectController.updateProject
  );

module.exports = router;

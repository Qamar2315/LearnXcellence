const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateViva } = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isProjectCreator,
} = require("../middlewares/authorization");
const vivaController = require("../controllers/vivaController");

router
  .route("/:courseId/:projectId/add")
  .post(isLogin, isStudent, isProjectCreator, vivaController.addViva);

router
  .route("/:courseId/getTodayVivas")
  .get(isLogin, vivaController.getTodaysViva);

router
  .route("/:courseId/:vivaId")
  .get(isLogin, vivaController.sendViva)
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateViva,
    vivaController.updateViva
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateViva } = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isProjectCreator,
  isCourseStudent,
} = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const vivaController = require("../controllers/vivaController");

router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    isProjectCreator,
    vivaController.addViva
  );

router
  .route("/:courseId/getTodayVivas")
  .get(isLogin, isEmailVerified, vivaController.getTodaysViva);

router
  .route("/:courseId/getAllVivas")
  .get(isLogin, isEmailVerified,isCourseCreator, vivaController.getAllVivas);

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

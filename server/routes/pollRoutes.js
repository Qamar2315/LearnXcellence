const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { isTeacher, isCourseCreator, isStudent, isCourseStudent, isCourseCreatorOrCourseStudent } = require("../middlewares/authorization");
const { validatePoll } = require("../middlewares/schemaValidator");
router
  .route("/:courseId")
  .get(isLogin, isEmailVerified,isCourseCreatorOrCourseStudent, pollController.getPolls)
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validatePoll,
    pollController.createPoll
  );

router
  .route("/:courseId/poll/:pollId")
  .get(isLogin, isEmailVerified,isCourseCreatorOrCourseStudent, pollController.getPoll)
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    pollController.deletePoll
  );

router
  .route("/:courseId/poll/:pollId/vote")
  .post(isLogin, isEmailVerified,isStudent,isCourseStudent, pollController.votePoll);

module.exports = router;

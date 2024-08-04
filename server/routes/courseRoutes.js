const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const {
  validateCourse,
  validateDate,
} = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
} = require("../middlewares/authorization");
const courseController = require("../controllers/courseController");

router
  .route("/create")
  .post(isLogin, isTeacher, validateCourse, courseController.createCourse);

router.route("/getAll").get(isLogin, courseController.sendAllCourses);

router
  .route("/updateViva/:courseId")
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateDate,
    courseController.updateVivaSchedule
  );

router
  .route("/updateProject/:courseId")
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateDate,
    courseController.updateProjectSchedule
  );

router
  .route("/:courseId")
  .get(isLogin, courseController.sendCourse)
  .put(isLogin, isTeacher, isCourseCreator, courseController.updateCourseName)
  .delete(isLogin, isTeacher, isCourseCreator, courseController.deleteCourse);

router
  .route("/:courseId/leave")
  .put(isLogin, isStudent, courseController.leaveCourse);

router.route("/join").post(isLogin, isStudent, courseController.joinCourse);

module.exports = router;

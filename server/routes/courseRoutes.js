const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const {
  validateCourse,
  validateDate,
  validateAddRemoveStudent,
} = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isCourseStudent,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const courseController = require("../controllers/courseController");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

router
  .route("/create")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    validateCourse,
    courseController.createCourse
  );

router
  .route("/getAll")
  .get(isLogin, isEmailVerified, courseController.sendAllCourses);

router
  .route("/updateViva/:courseId")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateDate,
    courseController.updateVivaSchedule
  );

router
  .route("/updateProject/:courseId")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateDate,
    courseController.updateProjectSchedule
  );

  
router
  .route("/search-student")
  .get(isLogin, isEmailVerified, isTeacher, courseController.searchStudent);

router
  .route("/:courseId")
  .get(
    isLogin,
    isEmailVerified,
    isCourseCreatorOrCourseStudent,
    courseController.sendCourse
  )
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    courseController.updateCourseName
  )
  .patch(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateCourse,
    courseController.updateCourse
  )
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    courseController.deleteCourse
  );

router
  .route("/:courseId/leave")
  .put(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    courseController.leaveCourse
  );

router
  .route("/:courseId/regenerate-course-code")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    courseController.regenerateCourseCode
  );

//to do add and leave student
router
  .route("/:courseId/add")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateAddRemoveStudent,
    courseController.addStudentToCourse
  );

router
  .route("/:courseId/remove")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateAddRemoveStudent,
    courseController.removeStudentFromCourse
  );

router
  .route("/join")
  .post(isLogin, isEmailVerified, isStudent, courseController.joinCourse);

module.exports = router;

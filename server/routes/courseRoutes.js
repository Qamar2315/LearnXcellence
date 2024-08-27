const express = require("express");
const router = express.Router();

// Controller
const courseController = require("../controllers/courseController");

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isCourseStudent,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const {
  validateCourse,
  validateDate,
  validateAddRemoveStudent,
} = require("../middlewares/schemaValidator");

// --- Public Routes ---

/**
 * @route  GET /api/courses/getAll
 * @desc   Get all courses
 * @access Public (Login and Email Verification Required)
 */
router.get(
  "/getAll",
  isLogin,
  isEmailVerified,
  courseController.sendAllCourses
);

// --- Protected Routes (Authentication Required) ---

/**
 * @route  POST /api/courses/create
 * @desc   Create a new course
 * @access Private (Teacher only)
 */
router.post(
  "/create",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateCourse,
  courseController.createCourse
);

/**
 * @route  GET /api/courses/search-student
 * @desc   Search for a student (by email)
 * @access Private (Teacher only)
 */
router.get(
  "/search-student",
  isLogin,
  isEmailVerified,
  isTeacher,
  courseController.searchStudent
);

/**
 * @route  POST /api/courses/join
 * @desc   Join a course using a course code
 * @access Private (Student only)
 */
router.post(
  "/join",
  isLogin,
  isEmailVerified,
  isStudent,
  courseController.joinCourse
);

// --- Course Specific Routes (Authentication Required) ---

/**
 * @route  GET /api/courses/:courseId
 * @desc   Get details of a specific course
 * @access Private (Course Creator, Course Teacher, or Course Student)
 */
router.get(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  courseController.sendCourse
);

/**
 * @route  PUT /api/courses/:courseId
 * @desc   Update a course's name
 * @access Private (Course Creator only)
 */
router.put(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.updateCourseName
);

/**
 * @route  PATCH /api/courses/:courseId
 * @desc   Update a course's details
 * @access Private (Course Creator only)
 */
router.patch(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateCourse,
  courseController.updateCourse
);

/**
 * @route  DELETE /api/courses/:courseId
 * @desc   Delete a course
 * @access Private (Course Creator only)
 */
router.delete(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.deleteCourse
);

/**
 * @route  PUT /api/courses/:courseId/leave
 * @desc   Leave a course
 * @access Private (Student enrolled in the course only)
 */
router.put(
  "/:courseId/leave",
  isLogin,
  isEmailVerified,
  isStudent,
  isCourseStudent,
  courseController.leaveCourse
);

/**
 * @route  PUT /api/courses/:courseId/regenerate-course-code
 * @desc   Regenerate the course code for a course
 * @access Private (Course Creator only)
 */
router.put(
  "/:courseId/regenerate-course-code",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.regenerateCourseCode
);

/**
 * @route  PUT /api/courses/:courseId/add
 * @desc   Add a student to a course
 * @access Private (Course Creator only)
 */
router.put(
  "/:courseId/add",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateAddRemoveStudent,
  courseController.addStudentToCourse
);

/**
 * @route  PUT /api/courses/:courseId/remove
 * @desc   Remove a student from a course
 * @access Private (Course Creator only)
 */
router.put(
  "/:courseId/remove",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateAddRemoveStudent,
  courseController.removeStudentFromCourse
);

/**
 * @route  PUT /api/courses/updateViva/:courseId
 * @desc   Update viva schedule for a course
 * @access Private (Course Creator only)
 */
router.put(
  "/updateViva/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateDate,
  courseController.updateVivaSchedule
);

/**
 * @route  PUT /api/courses/updateProject/:courseId
 * @desc   Update project schedule for a course
 * @access Private (Course Creator only)
 */
router.put(
  "/updateProject/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateDate,
  courseController.updateProjectSchedule
);

module.exports = router;

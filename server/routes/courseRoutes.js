const express = require("express");
const router = express.Router();

// Controller for handling course-related logic
const courseController = require("../controllers/courseController");

// Middleware for authentication and authorization
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isCourseStudent,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");

// Middleware for data validation
const {
  validateCourse,
  validateDate,
  validateAddRemoveStudent,
} = require("../middlewares/schemaValidator");

// --- Public Routes ---

// Get all courses (accessible by anyone)
router.get(
  "/getAll",
  isLogin,
  isEmailVerified,
  courseController.sendAllCourses
);

// --- Protected Routes (require authentication) ---

// Create a new course (Teacher only)
router.post(
  "/create",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateCourse, // Validate course data
  courseController.createCourse
);

// Search for a student (Teacher only)
router.get(
  "/search-student",
  isLogin,
  isEmailVerified,
  isTeacher,
  courseController.searchStudent
);

// Join a course using a course code (Student only)
router.post(
  "/join",
  isLogin,
  isEmailVerified,
  isStudent,
  courseController.joinCourse
);

// --- Course Specific Routes (require authentication) ---

// Get a specific course
// (Accessible by Course Creator, Course Teacher and Course Student)
router.get(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  courseController.sendCourse
);

// Update a course's name (Course Creator only)
router.put(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.updateCourseName
);

// Update a course's details (Course Creator only)
router.patch(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateCourse, // Validate course data
  courseController.updateCourse
);

// Delete a course (Course Creator only)
router.delete(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.deleteCourse
);

// Leave a course (Student only)
router.put(
  "/:courseId/leave",
  isLogin,
  isEmailVerified,
  isStudent,
  isCourseStudent, // Ensure the student is enrolled in the course
  courseController.leaveCourse
);

// Regenerate the course code (Course Creator only)
router.put(
  "/:courseId/regenerate-course-code",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  courseController.regenerateCourseCode
);

// Add a student to a course (Course Creator only)
router.put(
  "/:courseId/add",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateAddRemoveStudent, // Validate student data
  courseController.addStudentToCourse
);

// Remove a student from a course (Course Creator only)
router.put(
  "/:courseId/remove",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateAddRemoveStudent, // Validate student data
  courseController.removeStudentFromCourse
);

// Update viva schedule for a course (Course Creator only)
router.put(
  "/updateViva/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  validateDate,
  courseController.updateVivaSchedule
);

// Update project schedule for a course (Course Creator only)
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

const express = require("express");
const router = express.Router();

// Controller for handling assignment logic
const assignmentController = require("../controllers/assignmentController");

// Middleware for handling file uploads (using multer)
const { uploadAssignment } = require("../middlewares/multer/uploadAssignment");

// Middleware for authentication and authorization
const {
  isCourseCreator,
  isTeacher,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for assignment data validation
const { validateAssignment } = require("../middlewares/schemaValidator");

/**
 * @route GET /api/:courseId
 * @description Get all assignments for a specific course
 * @access Private (Teacher, Course Creator)
 */
router.get(
  "/:courseId",
  isLogin,                 // Ensure the user is logged in
  isEmailVerified,         // Ensure the user's email is verified
  isTeacher,               // Ensure the user is a teacher
  isCourseCreator,         // Ensure the user is the course creator
  assignmentController.getAssignments // Controller function to get all assignments
);

/**
 * @route POST /api/:courseId
 * @description Create a new assignment for a specific course
 * @access Private (Teacher, Course Creator)
 */
router.post(
  "/:courseId",
  isLogin,                     // Ensure the user is logged in
  isEmailVerified,             // Ensure the user's email is verified
  isTeacher,                   // Ensure the user is a teacher
  isCourseCreator,             // Ensure the user is the course creator
  uploadAssignment.single("assignment_document"), // Middleware to handle file upload
  validateAssignment,          // Middleware to validate assignment data
  assignmentController.createAssignment // Controller function to create a new assignment
);

/**
 * @route GET /api/:courseId/assignment/:assignmentId/download
 * @description Download a specific assignment document
 * @access Private (Course Creator or Course Student)
 */
router.get(
  "/:courseId/assignment/:assignmentId/download",
  isLogin,                                // Ensure the user is logged in
  isEmailVerified,                        // Ensure the user's email is verified
  isCourseCreatorOrCourseStudent,         // Allow access to course creators or students
  assignmentController.downloadAssignment // Controller function to download assignment
);

/**
 * @route GET /api/:courseId/assignment/:assignmentId
 * @description Get a specific assignment's details
 * @access Private (Logged-in users only)
 */
router.get(
  "/:courseId/assignment/:assignmentId",
  isLogin,                 // Ensure the user is logged in
  isEmailVerified,         // Ensure the user's email is verified
  assignmentController.getAssignment // Controller function to get assignment details
);

/**
 * @route PUT /api/:courseId/assignment/:assignmentId
 * @description Update an existing assignment
 * @access Private (Teacher, Course Creator)
 */
router.put(
  "/:courseId/assignment/:assignmentId",
  isLogin,                     // Ensure the user is logged in
  isEmailVerified,             // Ensure the user's email is verified
  isTeacher,                   // Ensure the user is a teacher
  isCourseCreator,             // Ensure the user is the course creator
  uploadAssignment.single("assignment_document"), // Middleware to handle file upload for updates
  validateAssignment,          // Middleware to validate updated assignment data
  assignmentController.updateAssignment // Controller function to update assignment
);

/**
 * @route DELETE /api/:courseId/assignment/:assignmentId
 * @description Delete an existing assignment
 * @access Private (Teacher, Course Creator)
 */
router.delete(
  "/:courseId/assignment/:assignmentId",
  isLogin,                     // Ensure the user is logged in
  isEmailVerified,             // Ensure the user's email is verified
  isTeacher,                   // Ensure the user is a teacher
  isCourseCreator,             // Ensure the user is the course creator
  assignmentController.deleteAssignment // Controller function to delete assignment
);

module.exports = router;

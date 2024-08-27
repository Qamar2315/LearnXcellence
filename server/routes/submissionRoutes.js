const express = require("express");
const router = express.Router();

// Controller for handling submission-related logic
const submissionController = require("../controllers/submissionController");

// Middleware for authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const { isStudent, isTeacher, isCourseCreator, isCourseStudent } = require("../middlewares/authorization");

// Middleware for request validation
const { validateSubmission } = require("../middlewares/schemaValidator");

// Middleware for file uploads
const { uploadSubmission } = require("../middlewares/multer/uploadSubmission");

/**
 * @route GET /api/:courseId/submission/:submissionId/download
 * @description Download a submission for a course (teacher or course creator access)
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId/submission/:submissionId/download")
  .get(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isTeacher,               // Ensure the user is a teacher
    isCourseCreator,         // Ensure the user is a course creator
    submissionController.downloadSubmissionTeacher // Controller function to handle download
  );

/**
 * @route GET /api/:courseId/assignment/:assignmentId
 * @description Get all submissions for an assignment (teacher or course creator access)
 * @access Private (Teacher, Course Creator)
 * 
 * @route POST /api/:courseId/assignment/:assignmentId
 * @description Create a new submission for an assignment (student access)
 * @access Private (Student, Course Student)
 */
router
  .route("/:courseId/assignment/:assignmentId")
  .get(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isTeacher,               // Ensure the user is a teacher
    isCourseCreator,         // Ensure the user is a course creator
    submissionController.getSubmissions // Controller function to get all submissions
  )
  .post(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isStudent,               // Ensure the user is a student
    isCourseStudent,         // Ensure the user is a course student
    uploadSubmission.single("submision_document"), // Handle file upload
    submissionController.createSubmission // Controller function to create a new submission
  );

/**
 * @route GET /api/assignment/:assignmentId/submissions/:submissionId/download
 * @description Download a specific submission (student access)
 * @access Private (Student)
 */
router
  .route("/assignment/:assignmentId/submissions/:submissionId/download")
  .get(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isStudent,               // Ensure the user is a student
    submissionController.downloadSubmission // Controller function to handle download
  );

/**
 * @route GET /api/assignment/:assignmentId/submissions/:submissionId
 * @description Get a specific submission (student access)
 * 
 * @route PUT /api/assignment/:assignmentId/submissions/:submissionId
 * @description Update a specific submission (student access)
 * 
 * @route DELETE /api/assignment/:assignmentId/submissions/:submissionId
 * @description Delete a specific submission (student access)
 * @access Private (Student)
 */
router
  .route("/assignment/:assignmentId/submissions/:submissionId")
  .get(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isStudent,               // Ensure the user is a student
    submissionController.getSubmission // Controller function to get a specific submission
  )
  .put(
    isLogin,                 // Ensure the user is logged in
    isEmailVerified,         // Ensure the user's email is verified
    isStudent,               // Ensure the user is a student
    uploadSubmission.single("submision_document"), // Handle file upload
    submissionController.updateSubmission // Controller function to update a submission
  )
  .delete(
    isLogin,                 // Ensure the user is logged in
    isStudent,               // Ensure the user is a student
    submissionController.deleteSubmission // Controller function to delete a submission
  );

module.exports = router;

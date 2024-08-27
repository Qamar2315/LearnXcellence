const express = require("express");
const router = express.Router();

// Middleware for authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for request validation
const { validateRemark } = require("../middlewares/schemaValidator");

// Middleware for role-based authorization
const {
  isTeacher,
  isCourseCreator,
  isStudent,
  isProjectGroupMember,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");

// Controller for handling remark-related logic
const remarkController = require("../controllers/remarkController");

// --- Routes for Managing Viva Remarks ---

/**
 * @route POST /api/remarks/viva/:courseId/:projectId/add
 * @description Add a remark to a viva associated with a specific course and project
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/viva/:courseId/:projectId/add")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is a course creator
    validateRemark,         // Validate the remark data
    remarkController.addRemarkToViva // Controller function to add a remark to a viva
  );

/**
 * @route GET /api/remarks/viva/:courseId/:projectId/:remarkId
 * @description Get a specific remark on a viva
 * @access Private (Students, Project Group Members)
 * 
 * @route PUT /api/remarks/viva/:courseId/:projectId/:remarkId
 * @description Update a specific remark on a viva
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/viva/:courseId/:projectId/:remarkId")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    isProjectGroupMember,   // Ensure the user is a project group member
    remarkController.sendRemark // Controller function to send a remark
  )
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is a course creator
    validateRemark,         // Validate the remark data
    remarkController.updateRemark // Controller function to update a remark
  );

// --- Routes for Managing Submission Remarks ---

/**
 * @route POST /api/remarks/submission/:courseId/:submissionId/add
 * @description Add a remark to a submission
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/submission/:courseId/:submissionId/add")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is a course creator
    validateRemark,         // Validate the remark data
    remarkController.addRemarkToSubmission // Controller function to add a remark to a submission
  );

/**
 * @route GET /api/remarks/submission/:courseId/:submissionId/:remarkId
 * @description Get a specific remark on a submission
 * @access Private (Student, Course Creator or Course Student)
 * 
 * @route PUT /api/remarks/submission/:courseId/:submissionId/:remarkId
 * @description Update a specific remark on a submission
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/submission/:courseId/:submissionId/:remarkId")
  .get(
    isLogin,                // Ensure the user is logged in
    isStudent,              // Ensure the user is a student
    isCourseCreatorOrCourseStudent, // Ensure the user is a course creator or course student
    remarkController.readSubmissionRemark // Controller function to read a submission remark
  )
  .put(
    isLogin,                // Ensure the user is logged in
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is a course creator
    validateRemark,         // Validate the remark data
    remarkController.updateSubmissionRemark // Controller function to update a submission remark
  );

module.exports = router;

const express = require("express");
const router = express.Router();

// Middleware for authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const { isTeacher, isCourseCreator, isCourseCreatorOrCourseStudent } = require("../middlewares/authorization");

// Middleware for request validation
const { validateStatus } = require("../middlewares/schemaValidator");

// Controller for handling status-related logic
const statusController = require("../controllers/statusController");

/**
 * @route POST /api/status/:courseId/:projectId/add
 * @description Add a new status update to a project within a course
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,               // Ensure the user is logged in
    isTeacher,             // Ensure the user is a teacher
    isEmailVerified,       // Ensure the user's email is verified
    isCourseCreator,       // Ensure the user is a course creator
    validateStatus,        // Validate the status data
    statusController.addStatus // Controller function to add a status
  );

/**
 * @route GET /api/status/:courseId/:projectId/:statusId
 * @description Get a specific status update for a project within a course
 * @access Private (Course Creator or Course Student)
 * 
 * @route PUT /api/status/:courseId/:projectId/:statusId
 * @description Update a specific status for a project
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId/:projectId/:statusId")
  .get(
    isLogin,                    // Ensure the user is logged in
    isEmailVerified,            // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent, // Ensure the user is a course creator or student in the course
    statusController.sendStatus // Controller function to get a status
  )
  .put(
    isLogin,                    // Ensure the user is logged in
    isEmailVerified,            // Ensure the user's email is verified
    isTeacher,                  // Ensure the user is a teacher
    isCourseCreator,            // Ensure the user is a course creator
    validateStatus,             // Validate the status data
    statusController.updateStatus // Controller function to update a status
  );

module.exports = router;

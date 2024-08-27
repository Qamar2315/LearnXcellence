const express = require("express");
const router = express.Router();

// Middleware for user authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const {
  isStudent,
  isCourseStudent,
  isProjectCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");

// Middleware for request validation
const { validateProject } = require("../middlewares/schemaValidator");

// Controller for handling project-related logic
const projectController = require("../controllers/projectController");

// --- Project Routes ---

// Route for creating a new project
router
  .route("/create")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    isCourseStudent,        // Ensure the student is enrolled in the course
    validateProject,        // Validate the project data
    projectController.createProject // Controller function to create a project
  );

// Route for adding a member to a specific project
router
  .route("/:courseId/:projectId/add-member")
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isCourseStudent,        // Ensure the user is a student in the course
    isProjectCreator,       // Ensure the user is the project creator
    projectController.addMember // Controller function to add a member to the project
  );

// Route for removing a member from a specific project
router
  .route("/:courseId/:projectId/:memberId/remove-member")
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isCourseStudent,        // Ensure the user is a student in the course
    isProjectCreator,       // Ensure the user is the project creator
    projectController.removeMember // Controller function to remove a member from the project
  );

// Route for generating project suggestions for a course
router
  .route("/:courseId/generate-project-suggestions")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    isCourseStudent,        // Ensure the student is enrolled in the course
    projectController.generateProjectSuggestions // Controller function to generate project suggestions
  );

// Routes for managing a specific project
router
  .route("/:courseId/:projectId")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent, // Ensure the user is either a course creator or a student in the course
    projectController.sendProject // Controller function to send project details
  )
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    isProjectCreator,       // Ensure the user is the project creator
    validateProject,        // Validate the project data before updating
    projectController.updateProject // Controller function to update the project
  )
  .delete(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent, // Ensure the user is either a course creator or a student in the course
    projectController.deleteProject // Controller function to delete the project
  );

module.exports = router;

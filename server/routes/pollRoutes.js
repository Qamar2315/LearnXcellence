const express = require("express");
const router = express.Router();

// Controller for handling poll-related logic
const pollController = require("../controllers/pollController");

// Middleware for user authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const {
  isTeacher,
  isCourseCreator,
  isStudent,
  isCourseStudent,
  isCourseCreatorOrCourseStudent
} = require("../middlewares/authorization");

// Middleware for validating poll data
const { validatePoll } = require("../middlewares/schemaValidator");

// --- Poll Routes ---

// Routes for managing polls within a specific course
router
  .route("/:courseId")
  // Get all polls for a course (accessible to course creators or students)
  .get(
    isLogin,                      // Ensure the user is logged in
    isEmailVerified,              // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent, // Ensure the user is a course creator or student
    pollController.getPolls       // Controller function to retrieve polls
  )
  // Create a new poll for a course (restricted to teachers and course creators)
  .post(
    isLogin,                      // Ensure the user is logged in
    isEmailVerified,              // Ensure the user's email is verified
    isTeacher,                    // Ensure the user is a teacher
    isCourseCreator,              // Ensure the user is a course creator
    validatePoll,                 // Validate the poll data
    pollController.createPoll     // Controller function to create a poll
  );

// Routes for managing a specific poll within a course
router
  .route("/:courseId/poll/:pollId")
  // Get details of a specific poll (accessible to course creators or students)
  .get(
    isLogin,                      // Ensure the user is logged in
    isEmailVerified,              // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent, // Ensure the user is a course creator or student
    pollController.getPoll        // Controller function to retrieve poll details
  )
  // Delete a specific poll (restricted to teachers and course creators)
  .delete(
    isLogin,                      // Ensure the user is logged in
    isEmailVerified,              // Ensure the user's email is verified
    isTeacher,                    // Ensure the user is a teacher
    isCourseCreator,              // Ensure the user is a course creator
    pollController.deletePoll     // Controller function to delete a poll
  );

// Route for voting on a specific poll within a course
router
  .route("/:courseId/poll/:pollId/vote")
  .post(
    isLogin,                      // Ensure the user is logged in
    isEmailVerified,              // Ensure the user's email is verified
    isStudent,                    // Ensure the user is a student
    isCourseStudent,              // Ensure the user is a student in the course
    pollController.votePoll       // Controller function to vote on a poll
  );

module.exports = router;

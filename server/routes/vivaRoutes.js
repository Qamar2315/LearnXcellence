const express = require("express");
const router = express.Router();

// Controllers for handling viva-related logic
const vivaController = require("../controllers/vivaController");

// Middleware for authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isProjectCreator,
  isCourseStudent,
} = require("../middlewares/authorization");

// Middleware for request validation
const { validateViva } = require("../middlewares/schemaValidator");

/**
 * @route POST /api/:courseId/:projectId/add
 * @description Add a viva to a project within a course (student, project creator access)
 * @access Private (Student, Course Student, Project Creator)
 */
router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,                   // Ensure the user is logged in
    isEmailVerified,           // Ensure the user's email is verified
    isStudent,                 // Ensure the user is a student
    isCourseStudent,           // Ensure the user is enrolled in the course
    isProjectCreator,          // Ensure the user is the project creator
    vivaController.addViva     // Controller function to add a viva
  );

/**
 * @route GET /api/:courseId/getTodayVivas
 * @description Get all vivas scheduled for today within a course
 * @access Private (Any logged-in user with email verified)
 */
router
  .route("/:courseId/getTodayVivas")
  .get(
    isLogin,                   // Ensure the user is logged in
    isEmailVerified,           // Ensure the user's email is verified
    vivaController.getTodaysViva // Controller function to get today's vivas
  );

/**
 * @route GET /api/:courseId/getAllVivas
 * @description Get all vivas for a course (course creator access)
 * @access Private (Course Creator)
 */
router
  .route("/:courseId/getAllVivas")
  .get(
    isLogin,                   // Ensure the user is logged in
    isEmailVerified,           // Ensure the user's email is verified
    isCourseCreator,           // Ensure the user is the course creator
    vivaController.getAllVivas // Controller function to get all vivas
  );

/**
 * @route GET /api/:courseId/:projectId/generate-viva-questions
 * @description Generate viva questions for a project based on query parameters
 * @access Private (Teacher, Course Creator)
 * 
 * Query Parameters:
 * - numberOfQuestions: Number of questions to generate (e.g., 5, 10).
 * - difficulty: Difficulty level of the questions (e.g., easy, medium, hard).
 * - questionType: Type of questions to generate (e.g., general, technical, conceptual).
 *   Options include general, technical, conceptual, analytical, problem-solving, design,
 *   implementation, testing, security, ux, ethical, project-management, research, future-scope.
 */
router
  .route("/:courseId/:projectId/generate-viva-questions")
  .get(
    isLogin,                    // Ensure the user is logged in
    isEmailVerified,            // Ensure the user's email is verified
    isTeacher,                  // Ensure the user is a teacher
    isCourseCreator,            // Ensure the user is the course creator
    vivaController.generateVivaQuestions // Controller function to generate viva questions
  );

/**
 * @route GET /api/:courseId/:vivaId
 * @description Retrieve details of a specific viva
 * @access Private (Any logged-in user)
 * 
 * @route PUT /api/:courseId/:vivaId
 * @description Update details of a specific viva (teacher, course creator access)
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId/:vivaId")
  .get(
    isLogin,                   // Ensure the user is logged in
    vivaController.sendViva    // Controller function to send viva details
  )
  .put(
    isLogin,                   // Ensure the user is logged in
    isTeacher,                 // Ensure the user is a teacher
    isCourseCreator,           // Ensure the user is the course creator
    validateViva,              // Validate the viva data
    vivaController.updateViva  // Controller function to update viva details
  );

module.exports = router;

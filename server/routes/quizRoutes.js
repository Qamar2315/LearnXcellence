const express = require("express");
const router = express.Router();

// Controller for handling quiz-related logic
const quizController = require("../controllers/quizController");

// Middleware for user authentication and verification
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for role-based authorization
const {
  isTeacher,
  isCourseCreator,
  isCourseStudent,
  isStudent,
} = require("../middlewares/authorization");

// Middleware for request validation
const {
  validateQuiz,
  validateUpdateQuizScore,
  validateUpdateSubmissionFlag,
  validateQuizGenerationQuery,
  validateQuizGenerationBody,
} = require("../middlewares/schemaValidator");

// --- Quiz Routes ---

// Route to create a new quiz for a course
router
  .route("/:courseId/create")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    validateQuiz,           // Validate the quiz data
    quizController.createQuiz // Controller function to create a quiz
  );

/**
 * @route GET /api/quizzes/:courseId/generate
 * @description Generate quiz questions by topic
 * @access Private (Teachers, Course Creators)
 * @param {string} topic (query parameter) - The topic for question generation.
 * @param {number} [numberOfQuestions] (query parameter) - Number of questions (default: 5).
 * @param {string} [difficulty] (query parameter) - Difficulty level (easy, medium, hard, default: medium).
 */
router
  .route("/:courseId/generate")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    validateQuizGenerationQuery, // Validate query parameters for quiz generation
    quizController.generateQuizByTopic // Controller function to generate quiz by topic
  )
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    validateQuizGenerationBody, // Validate body for quiz generation
    quizController.generateQuizByTopicOrContent // Controller function to generate quiz by topic or content
  );

// Route to get quizzes by course
router
  .route("/course/:courseId")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    quizController.getQuizzesByCourse // Controller function to get quizzes by course
  );

// Route to get a specific quiz for a student
router
  .route("/:courseId/:id/get")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isCourseStudent,        // Ensure the user is a student in the course
    quizController.getQuizStudent // Controller function to get quiz details for a student
  );

// Route for students to start a quiz
router
  .route("/:courseId/:id/start")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    isCourseStudent,        // Ensure the student is enrolled in the course
    quizController.startQuiz // Controller function to start a quiz
  );

// Route to generate a PDF report of all students' quiz submissions
router
  .route("/:courseId/:id/pdf")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    quizController.generatePDFAllStudents // Controller function to generate a PDF for all students
  );

// Route to generate a PDF report for a specific student's quiz submission
router
  .route("/:courseId/:id/pdf/:studentId")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    quizController.generatePDFStudent // Controller function to generate a PDF for a specific student
  );

// Route for students to submit a quiz
router
  .route("/:courseId/:id/submit")
  .post(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isStudent,              // Ensure the user is a student
    quizController.submitQuiz // Controller function to submit a quiz
  );

// Route to update quiz marks for a submission
router
  .route("/:courseId/:quizId/update-marks/:submissionId")
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    validateUpdateQuizScore, // Validate the update of quiz score
    quizController.updateSubmissionMarks // Controller function to update marks
  );

// Route to update a flag on a quiz submission
router
  .route("/:courseId/:quizId/update-flag/:submissionId")
  .put(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    validateUpdateSubmissionFlag, // Validate the update of submission flag
    quizController.updateSubmissionFlag // Controller function to update a flag on a submission
  );

// Routes to manage a specific quiz
router
  .route("/:courseId/:id")
  .get(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    quizController.getQuiz // Controller function to get quiz details
  )
  .patch(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    validateQuiz,           // Validate the quiz data before updating
    quizController.updateQuiz // Controller function to update the quiz
  )
  .delete(
    isLogin,                // Ensure the user is logged in
    isEmailVerified,        // Ensure the user's email is verified
    isTeacher,              // Ensure the user is a teacher
    isCourseCreator,        // Ensure the user is the course creator
    quizController.deleteQuiz // Controller function to delete the quiz
  );

module.exports = router;

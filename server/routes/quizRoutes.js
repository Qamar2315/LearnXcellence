const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { isLogin } = require("../middlewares/isLogin");
const {
  isTeacher,
  isCourseCreator,
  isCourseStudent,
  isStudent,
} = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  validateQuiz,
  validateUpdateQuizScore,
  validateUpdateSubmissionFlag,
  validateQuizGenerationQuery,
  validateQuizGenerationBody,
} = require("../middlewares/schemaValidator");

router
  .route("/:courseId/create")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateQuiz,
    quizController.createQuiz
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
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateQuizGenerationQuery,
    quizController.generateQuizByTopic
  )
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateQuizGenerationBody,
    quizController.generateQuizByTopicOrContent
  );

router
  .route("/course/:courseId")
  .get(isLogin, isEmailVerified, quizController.getQuizzesByCourse);

router
  .route("/:courseId/:id/get")
  .get(
    isLogin,
    isEmailVerified,
    isCourseStudent,
    isCourseStudent,
    quizController.getQuizStudent
  );

router
  .route("/:courseId/:id/start")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    quizController.startQuiz
  );

router
  .route("/:courseId/:id/pdf")
  .post(isLogin, isEmailVerified, isTeacher, isCourseCreator, quizController.generatePDFAllStudents);

router
  .route("/:courseId/:id/pdf/:studentId")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    quizController.generatePDFStudent
  );

router
  .route("/:courseId/:id/submit")
  .post(isLogin, isEmailVerified, isStudent, quizController.submitQuiz);

router
  .route("/:courseId/:quizId/update-marks/:submissionId")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    validateUpdateQuizScore,
    quizController.updateSubmissionMarks
  );

router
  .route("/:courseId/:quizId/update-flag/:submissionId")
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    validateUpdateSubmissionFlag,
    quizController.updateSubmissionFlag
  );

router
  .route("/:courseId/:id")
  .get(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    quizController.getQuiz
  )
  .patch(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    validateQuiz,
    quizController.updateQuiz
  )
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    quizController.deleteQuiz
  );

module.exports = router;

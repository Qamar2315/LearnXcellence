const express = require("express");
const router = express.Router();

// Controller
const quizController = require("../controllers/quizController");

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { isTeacher, isCourseCreator, isCourseStudent, isStudent } = require("../middlewares/authorization");
const { 
  validateQuiz, 
  validateUpdateQuizScore, 
  validateUpdateSubmissionFlag,
  validateQuizGenerationQuery,
  validateQuizGenerationBody
} = require("../middlewares/schemaValidator");

// --- Quiz Routes ---

/**
 * @route  POST /api/quizzes/:courseId/create
 * @desc   Create a new quiz for a course 
 * @access Private (Teacher and Course Creator only)
 */
router.post("/:courseId/create", 
  isLogin, 
  isEmailVerified, 
  isTeacher, 
  isCourseCreator, 
  validateQuiz, 
  quizController.createQuiz
);

/**
 * @route  GET /api/quizzes/:courseId/generate
 * @desc   Generate quiz questions by topic 
 * @access Private (Teacher and Course Creator only)
 */
/**
 * @route  POST /api/quizzes/:courseId/generate
 * @desc   Generate quiz questions by topic or content
 * @access Private (Teacher and Course Creator only)
 */
router.route("/:courseId/generate")
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

/**
 * @route  GET /api/quizzes/course/:courseId
 * @desc   Get quizzes by course
 * @access Private (Authenticated users, adjust middleware as needed) 
 */
router.get("/course/:courseId", isLogin, isEmailVerified, quizController.getQuizzesByCourse);

/**
 * @route  GET /api/quizzes/:courseId/:id/get 
 * @desc   Get a specific quiz for a student
 * @access Private (Student enrolled in the course only)
 */
router.get("/:courseId/:id/get", isLogin, isEmailVerified, isCourseStudent, quizController.getQuizStudent);

/**
 * @route  POST /api/quizzes/:courseId/:id/start 
 * @desc   Start a quiz for a student 
 * @access Private (Student enrolled in the course only)
 */
router.post("/:courseId/:id/start", isLogin, isEmailVerified, isStudent, isCourseStudent, quizController.startQuiz);

/**
 * @route  POST /api/quizzes/:courseId/:id/pdf 
 * @desc   Generate a PDF report of all students' quiz submissions
 * @access Private (Teacher and Course Creator only) 
 */
router.post("/:courseId/:id/pdf", 
  isLogin, 
  isEmailVerified, 
  isTeacher, 
  isCourseCreator, 
  quizController.generatePDFAllStudents
);

/**
 * @route  POST /api/quizzes/:courseId/:id/pdf/:studentId
 * @desc   Generate a PDF report for a specific student's quiz submission
 * @access Private (Teacher and Course Creator only) 
 */
router.post("/:courseId/:id/pdf/:studentId", 
  isLogin, 
  isEmailVerified, 
  isTeacher, 
  isCourseCreator, 
  quizController.generatePDFStudent
);

/**
 * @route  POST /api/quizzes/:courseId/:id/submit
 * @desc   Submit a quiz 
 * @access Private (Student only)
 */
router.post("/:courseId/:id/submit", isLogin, isEmailVerified, isStudent, quizController.submitQuiz);

/**
 * @route  PUT /api/quizzes/:courseId/:quizId/update-marks/:submissionId
 * @desc   Update quiz marks for a submission 
 * @access Private (Teacher only)
 */
router.put("/:courseId/:quizId/update-marks/:submissionId", 
  isLogin, 
  isEmailVerified, 
  isTeacher, 
  validateUpdateQuizScore, 
  quizController.updateSubmissionMarks
);

/**
 * @route  PUT /api/quizzes/:courseId/:quizId/update-flag/:submissionId
 * @desc   Update a flag on a quiz submission
 * @access Private (Teacher only)
 */
router.put("/:courseId/:quizId/update-flag/:submissionId", 
  isLogin, 
  isEmailVerified, 
  isTeacher, 
  validateUpdateSubmissionFlag, 
  quizController.updateSubmissionFlag 
);

/**
 * @route  GET /api/quizzes/:courseId/:id 
 * @desc   Get details of a specific quiz 
 * @access Private (Teacher and Course Creator only)
 * 
 * @route  PATCH /api/quizzes/:courseId/:id
 * @desc   Update a specific quiz
 * @access Private (Teacher and Course Creator only)
 * 
 * @route  DELETE /api/quizzes/:courseId/:id 
 * @desc   Delete a specific quiz 
 * @access Private (Teacher and Course Creator only)
 */
router.route("/:courseId/:id")
  .get(isLogin, isEmailVerified, isTeacher, isCourseCreator, quizController.getQuiz)
  .patch(
    isLogin, 
    isEmailVerified, 
    isTeacher, 
    isCourseCreator, 
    validateQuiz, 
    quizController.updateQuiz
  )
  .delete(isLogin, isEmailVerified, isTeacher, isCourseCreator, quizController.deleteQuiz);

module.exports = router;
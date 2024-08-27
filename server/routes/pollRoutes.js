const express = require("express");
const router = express.Router();

// Controller
const pollController = require("../controllers/pollController");

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { 
  isTeacher, 
  isCourseCreator, 
  isStudent, 
  isCourseStudent, 
  isCourseCreatorOrCourseStudent
} = require("../middlewares/authorization");
const { validatePoll } = require("../middlewares/schemaValidator");


// --- Poll Routes ---

/**
 * @route  GET /api/polls/:courseId
 * @desc   Get all polls for a course 
 * @access Private (Course Creator or Course Student)
 */
/**
 * @route  POST /api/polls/:courseId 
 * @desc   Create a new poll for a course 
 * @access Private (Teacher and Course Creator only)
 */
router.route("/:courseId")
  .get(
    isLogin, 
    isEmailVerified, 
    isCourseCreatorOrCourseStudent, 
    pollController.getPolls
  )
  .post(
    isLogin, 
    isEmailVerified, 
    isTeacher, 
    isCourseCreator, 
    validatePoll, 
    pollController.createPoll
  );

/**
 * @route  GET /api/polls/:courseId/poll/:pollId
 * @desc   Get details of a specific poll 
 * @access Private (Course Creator or Course Student)
 */
/**
 * @route  DELETE /api/polls/:courseId/poll/:pollId 
 * @desc   Delete a specific poll
 * @access Private (Teacher and Course Creator only) 
 */
router.route("/:courseId/poll/:pollId")
  .get(
    isLogin, 
    isEmailVerified, 
    isCourseCreatorOrCourseStudent, 
    pollController.getPoll
  )
  .delete(
    isLogin, 
    isEmailVerified, 
    isTeacher, 
    isCourseCreator, 
    pollController.deletePoll
  );

/**
 * @route  POST /api/polls/:courseId/poll/:pollId/vote
 * @desc   Vote on a specific poll
 * @access Private (Student in the course only)
 */
router.route("/:courseId/poll/:pollId/vote")
  .post(
    isLogin, 
    isEmailVerified, 
    isStudent, 
    isCourseStudent, 
    pollController.votePoll
  );

module.exports = router;
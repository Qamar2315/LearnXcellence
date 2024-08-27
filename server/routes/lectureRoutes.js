const express = require("express");
const router = express.Router();

// Controller
const lectureController = require("../controllers/lectureController");

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isCourseCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const { uploadLecture } = require("../middlewares/multer/uploadLecture");

// --- Lecture Routes ---

/**
 * @route  GET /api/lectures/:courseId
 * @desc   Get all lectures for a course
 * @access Private (Course Creator, Course Teacher, and Course Student)
 */
router.get(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.getLectures
);

/**
 * @route  POST /api/lectures/:courseId
 * @desc   Create a new lecture for a course
 * @access Private (Teacher and Course Creator only)
 */
router.post(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadLecture.single("lecture_video"),
  lectureController.createLecture
);

/**
 * @route  GET /api/lectures/:courseId/lecture/:lectureId
 * @desc   Get a specific lecture
 * @access Private (Course Creator, Course Teacher, and Course Student)
 */
router.get(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.getLecture
);

/**
 * @route  PUT /api/lectures/:courseId/lecture/:lectureId
 * @desc   Update a specific lecture
 * @access Private (Teacher and Course Creator only)
 */
router.put(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadLecture.single("lecture_video"),
  lectureController.updateLecture
);

/**
 * @route  DELETE /api/lectures/:courseId/lecture/:lectureId
 * @desc   Delete a specific lecture
 * @access Private (Teacher and Course Creator only)
 */
router.delete(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  lectureController.deleteLecture
);

/**
 * @route  GET /api/lectures/:courseId/lecture/:lectureId/download
 * @desc   Download a lecture video
 * @access Private (Course Creator, Course Teacher, and Course Student)
 */
router.get(
  "/:courseId/lecture/:lectureId/download",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.downloadLecture
);

module.exports = router;

const express = require("express");
const router = express.Router();

// Controller for handling lecture-related logic
const lectureController = require("../controllers/lectureController");

// Middleware for authentication and authorization
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isCourseCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");

// Middleware for handling lecture video uploads (using multer)
const { uploadLecture } = require("../middlewares/multer/uploadLecture");

// --- Lecture Routes ---

// Get all lectures for a course
// (Accessible by Course Creator, Course Teacher and Course Student)
router.get(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.getLectures
);

// Create a new lecture for a course (Teacher and Course Creator only)
router.post(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadLecture.single("lecture_video"), // Handle lecture video upload
  lectureController.createLecture
);

// Get a specific lecture
// (Accessible by Course Creator, Course Teacher and Course Student)
router.get(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.getLecture
);

// Update a specific lecture (Teacher and Course Creator only)
router.put(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadLecture.single("lecture_video"), // Handle lecture video upload for updates
  lectureController.updateLecture
);

// Delete a specific lecture (Teacher and Course Creator only)
router.delete(
  "/:courseId/lecture/:lectureId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  lectureController.deleteLecture
);

// Download a lecture video
// (Accessible by Course Creator, Course Teacher and Course Student)
router.get(
  "/:courseId/lecture/:lectureId/download",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  lectureController.downloadLecture
);

module.exports = router;

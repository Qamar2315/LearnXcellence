const express = require("express");
const lectureController = require("../controllers/lectureController");
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isCourseCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");
const { uploadLecture } = require("../middlewares/multer/uploadLecture");

const router = express.Router();

router
  .route("/:courseId")
  .get(isLogin, isEmailVerified, lectureController.getLectures)
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    uploadLecture.single("lecture_video"),
    lectureController.createLecture
  );

router
  .route("/:courseId/lecture/:lectureId")
  .get(
    isLogin,
    isEmailVerified,
    isCourseCreatorOrCourseStudent,
    lectureController.getLecture
  )
  .put(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    uploadLecture.single("lecture_video"),
    lectureController.updateLecture
  )
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator,
    lectureController.deleteLecture
  );

router
  .route("/:courseId/lecture/:lectureId/download")
  .get(isLogin, isEmailVerified,isCourseCreatorOrCourseStudent, lectureController.downloadLecture);

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateAnnouncement } = require("../middlewares/schemaValidator");
const { isTeacher, isCourseCreator, isCourseCreatorOrCourseStudent } = require("../middlewares/authorization");
const announcementController = require("../controllers/announcementController");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

router
  .route("/:courseId")
  .get(isLogin,isEmailVerified,isCourseCreatorOrCourseStudent, announcementController.getAllCourseAnnouncements)
  .post(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateAnnouncement,
    announcementController.sendCourseAnnouncement
  );

router
  .route("/:courseId/announcement/:announcementId")
  .delete(
    isLogin,
    isTeacher,
    isCourseCreator,
    announcementController.deleteAnnouncement
  )
  .patch(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateAnnouncement,
    announcementController.updateAnnouncement
  );

module.exports = router;

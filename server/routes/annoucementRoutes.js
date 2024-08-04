const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateAnnouncement } = require("../middlewares/schemaValidator");
const { isTeacher, isCourseCreator } = require("../middlewares/authorization");
const announcementController = require("../controllers/announcementController");

router
  .route("/:courseId/announcements")
  .get(isLogin, announcementController.getAllCourseAnnouncements)
  .post(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateAnnouncement,
    announcementController.sendCourseAnnouncement
  );

router
  .route("/:courseId/:announcementId")
  .delete(
    isLogin,
    isTeacher,
    isCourseCreator,
    announcementController.deleteAnnouncement
  );

module.exports = router;

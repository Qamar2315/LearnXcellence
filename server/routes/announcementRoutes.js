const express = require("express");
const router = express.Router();

// Import middleware functions for authentication and authorization.
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const {
  isTeacher,
  isCourseCreator,
  isCourseCreatorOrCourseStudent,
} = require("../middlewares/authorization");

// Import middleware for announcement data validation.
const { validateAnnouncement } = require("../middlewares/schemaValidator");

// Import the announcement controller for handling announcement-related logic.
const announcementController = require("../controllers/announcementController");

// Route for getting all announcements for a course and creating new announcements.
router
  .route("/:courseId")
  .get(
    isLogin,
    isEmailVerified,
    isCourseCreatorOrCourseStudent, // Only logged-in course creators or students can view announcements.
    announcementController.getAllCourseAnnouncements
  )
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator, // Only logged-in teachers who are course creators can create announcements.
    validateAnnouncement, // Validate announcement data before processing.
    announcementController.sendCourseAnnouncement
  );

// Route for deleting and updating a specific announcement.
router
  .route("/:courseId/announcement/:announcementId")
  .delete(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator, // Only logged-in teachers who are course creators can delete announcements.
    announcementController.deleteAnnouncement
  )
  .patch(
    isLogin,
    isEmailVerified,
    isTeacher,
    isCourseCreator, // Only logged-in teachers who are course creators can update announcements.
    validateAnnouncement, // Validate announcement data before processing.
    announcementController.updateAnnouncement
  );

module.exports = router;

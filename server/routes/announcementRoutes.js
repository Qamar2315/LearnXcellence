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

/**
 * @route GET /api/:courseId
 * @description Get all announcements for a specific course
 * @access Private (Course Creator or Course Student)
 * 
 * @route POST /api/:courseId
 * @description Create a new announcement for a specific course
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId")
  .get(
    isLogin,                                 // Ensure the user is logged in
    isEmailVerified,                         // Ensure the user's email is verified
    isCourseCreatorOrCourseStudent,          // Allow access only to course creators or students
    announcementController.getAllCourseAnnouncements // Controller function to get all announcements
  )
  .post(
    isLogin,                                 // Ensure the user is logged in
    isEmailVerified,                         // Ensure the user's email is verified
    isTeacher,                               // Ensure the user is a teacher
    isCourseCreator,                         // Ensure the user is the course creator
    validateAnnouncement,                    // Validate the announcement data
    announcementController.sendCourseAnnouncement // Controller function to create a new announcement
  );

/**
 * @route DELETE /api/:courseId/announcement/:announcementId
 * @description Delete a specific announcement
 * @access Private (Teacher, Course Creator)
 * 
 * @route PATCH /api/:courseId/announcement/:announcementId
 * @description Update a specific announcement
 * @access Private (Teacher, Course Creator)
 */
router
  .route("/:courseId/announcement/:announcementId")
  .delete(
    isLogin,                                 // Ensure the user is logged in
    isEmailVerified,                         // Ensure the user's email is verified
    isTeacher,                               // Ensure the user is a teacher
    isCourseCreator,                         // Ensure the user is the course creator
    announcementController.deleteAnnouncement // Controller function to delete an announcement
  )
  .patch(
    isLogin,                                 // Ensure the user is logged in
    isEmailVerified,                         // Ensure the user's email is verified
    isTeacher,                               // Ensure the user is a teacher
    isCourseCreator,                         // Ensure the user is the course creator
    validateAnnouncement,                    // Validate the announcement data
    announcementController.updateAnnouncement // Controller function to update an announcement
  );

module.exports = router;

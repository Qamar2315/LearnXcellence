const express = require("express");
const router = express.Router();

// Controller for handling assignment logic
const assignmentController = require("../controllers/assignmentController");

// Middleware for handling file uploads (using multer)
const { uploadAssignment } = require("../middlewares/multer/uploadAssignment");

// Middleware for authentication and authorization
const { isCourseCreator, isTeacher, isCourseCreatorOrCourseStudent } = require("../middlewares/authorization");
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for assignment data validation (assuming it exists)
const { validateAssignment } = require("../middlewares/schemaValidator");

// Define routes for assignment operations

// Get all assignments for a course (Teacher & Course Creator only)
router.get(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  assignmentController.getAssignments
);

// Create a new assignment (Teacher & Course Creator only)
router.post(
  "/:courseId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadAssignment.single("assignment_document"), // Handle file upload
  validateAssignment, // Validate assignment data
  assignmentController.createAssignment
);

// Download an assignment document ( Course students or creator only)
router.get(
  "/:courseId/assignment/:assignmentId/download",
  isLogin,
  isEmailVerified,
  isCourseCreatorOrCourseStudent,
  assignmentController.downloadAssignment
);

// Get a specific assignment (Logged-in users only)
router.get(
  "/:courseId/assignment/:assignmentId",
  isLogin,
  isEmailVerified,
  assignmentController.getAssignment
);

// Update an existing assignment (Teacher & Course Creator only)
router.put(
  "/:courseId/assignment/:assignmentId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  uploadAssignment.single("assignment_document"), // Handle file upload for updates
  validateAssignment, // Validate updated assignment data
  assignmentController.updateAssignment
);

// Delete an assignment (Teacher & Course Creator only)
router.delete(
  "/:courseId/assignment/:assignmentId",
  isLogin,
  isEmailVerified,
  isTeacher,
  isCourseCreator,
  assignmentController.deleteAssignment
);

module.exports = router;

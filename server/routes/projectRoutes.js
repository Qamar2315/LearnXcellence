const express = require("express");
const router = express.Router();

// Middleware
const { isLogin } = require("../middlewares/isLogin");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { 
  isStudent, 
  isCourseStudent, 
  isProjectCreator,
  isCourseCreatorOrCourseStudent
} = require("../middlewares/authorization");
const { validateProject, validateUpdateProject } = require("../middlewares/schemaValidator");

// Controller
const projectController = require("../controllers/projectController");

// --- Project Routes ---

/**
 * @route  POST /api/projects/create
 * @desc   Create a new project for a course 
 * @access Private (Student enrolled in the course only) 
 */
router.post("/create", 
  isLogin, 
  isEmailVerified, 
  isStudent, 
  isCourseStudent, 
  validateProject, 
  projectController.createProject
);

/**
 * @route  PUT /api/projects/:courseId/:projectId/:memberId/add-member
 * @desc   Add a member to a project
 * @access Private (Project Creator (and enrolled in the course) only)
 */
router.put("/:courseId/:projectId/:memberId/add-member",
  isLogin,
  isEmailVerified,
  isCourseStudent, 
  isProjectCreator, 
  projectController.addMember
);

/**
 * @route  PUT /api/projects/:courseId/:projectId/:memberId/remove-member
 * @desc   Remove a member from a project 
 * @access Private (Project Creator (and enrolled in the course) only)
 */
router.put("/:courseId/:projectId/:memberId/remove-member",
  isLogin,
  isEmailVerified,
  isCourseStudent, 
  isProjectCreator, 
  projectController.removeMember
);

/**
 * @route  GET /api/projects/:courseId/generate-project-suggestions
 * @desc   Generate project suggestions for a course
 * @access Private (Student enrolled in the course only)
 */
router.get("/:courseId/generate-project-suggestions",
  isLogin,
  isEmailVerified,
  isStudent,
  isCourseStudent, 
  projectController.generateProjectSuggestions
);

/**
 * @route  GET /api/projects/:courseId/:projectId
 * @desc   Get details of a specific project
 * @access Private (Course Creator or Student enrolled in the course)
 * 
 * @route  PUT /api/projects/:courseId/:projectId
 * @desc   Update a specific project 
 * @access Private (Project Creator (and enrolled in the course) only)
 *
 * @route  DELETE /api/projects/:courseId/:projectId
 * @desc   Delete a specific project 
 * @access Private (Course Creator or Student enrolled in the course)
 */
router.route("/:courseId/:projectId")
  .get(
    isLogin, 
    isEmailVerified, 
    isCourseCreatorOrCourseStudent,
    projectController.sendProject 
  )
  .put(
    isLogin, // Login is required
    isEmailVerified, // Email verification is required
    isStudent, // Only student can update
    isProjectCreator, // Only project creator can update
    validateUpdateProject,  // Validate the project schema
    projectController.updateProject // Update the project
  )
  .delete(
    isLogin, 
    isEmailVerified, 
    isCourseCreatorOrCourseStudent, 
    projectController.deleteProject
  );

module.exports = router;
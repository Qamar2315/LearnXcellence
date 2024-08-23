const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const { validateViva } = require("../middlewares/schemaValidator");
const {
  isTeacher,
  isStudent,
  isCourseCreator,
  isProjectCreator,
  isCourseStudent,
} = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const vivaController = require("../controllers/vivaController");

router
  .route("/:courseId/:projectId/add")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    isCourseStudent,
    isProjectCreator,
    vivaController.addViva
  );

router
  .route("/:courseId/getTodayVivas")
  .get(isLogin, isEmailVerified, vivaController.getTodaysViva);

router
  .route("/:courseId/getAllVivas")
  .get(isLogin, isEmailVerified, isCourseCreator, vivaController.getAllVivas);

// Parameters for generating viva questions
/**
 * Query Parameters:
 * - numberOfQuestions: The number of questions to generate (e.g., 5, 10).
 * - difficulty: The difficulty level of the questions (e.g., easy, medium, hard).
 * - questionType: The type of questions to generate. Options include:
 *   - general: Broad questions about the project.
 *   - technical: Questions about the technical aspects of the project.
 *   - conceptual: Questions on theoretical concepts applied in the project.
 *   - analytical: Questions requiring analysis of project aspects.
 *   - problem-solving: Scenarios requiring problem-solving related to the project.
 *   - design: Questions about design choices and system architecture.
 *   - implementation: Questions about the coding and implementation details.
 *   - testing: Questions related to testing methodologies and practices.
 *   - security: Questions about security measures and data protection.
 *   - ux: Questions related to user experience and interface design.
 *   - ethical: Questions about ethical and legal considerations.
 *   - project-management: Questions about project management techniques.
 *   - research: Questions about research methods and data gathering.
 *   - future-scope: Questions about future enhancements and scalability.
 */

router.route("/:courseId/:projectId/generate-viva-questions").get(
  isLogin,
  isEmailVerified,
  isTeacher, // Only allow teachers to access this route
  isCourseCreator, // Only allow course creator to access this route
  vivaController.generateVivaQuestions
);

router
  .route("/:courseId/:vivaId")
  .get(isLogin, vivaController.sendViva)
  .put(
    isLogin,
    isTeacher,
    isCourseCreator,
    validateViva,
    vivaController.updateViva
  );

module.exports = router;

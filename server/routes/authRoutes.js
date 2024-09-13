const express = require("express");
const router = express.Router();

// Controllers for handling authentication and user data
const authController = require("../controllers/authController");

// Middleware for request body validation
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validateUpdateName,
  validateOtp,
  validateResetPassword,
} = require("../middlewares/schemaValidator");

// Middleware for authentication and authorization
const { isLogin } = require("../middlewares/isLogin");
const { isStudent, isTeacher } = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for handling file uploads (using multer)
const { uploadProfile } = require("../middlewares/multer/uploadProfile");
const { uploadFaceBiometricData } = require("../middlewares/multer/uploadFace");

// --- Public Routes ---

/**
 * @route POST /api/auth/register
 * @description Register a new student
 * @access Public
 */
router.post("/register", validateRegister, authController.registerStudent);

/**
 * @route POST /api/auth/login
 * @description Login an existing student
 * @access Public
 */
router.post("/login", validateLogin, authController.loginStudent);

/**
 * @route POST /api/auth/teacher/register
 * @description Register a new teacher
 * @access Public
 */
router.post("/teacher/register", validateRegister, authController.registerTeacher);

/**
 * @route POST /api/auth/teacher/login
 * @description Login an existing teacher
 * @access Public
 */
router.post("/teacher/login", validateLogin, authController.loginTeacher);

// --- Protected Routes (require authentication) ---

/**
 * @route POST /api/auth/generate-otp
 * @description Generate OTP (One-Time Password) for authenticated users
 * @access Private
 */
router.post("/generate-otp", isLogin, authController.generateOtp);

/**
 * @route POST /api/auth/verify-otp
 * @description Verify OTP for authenticated users
 * @access Private
 */
router.post("/verify-otp", isLogin, validateOtp, authController.verifyOtp);

// --- Student Specific Routes (require authentication and student role) ---

/**
 * @route PATCH /api/auth/student/update-password
 * @description Update the password for a student
 * @access Private (Student)
 */
router.patch(
  "/student/update-password",
  isLogin,
  isEmailVerified,
  isStudent,
  validateUpdatePassword,
  authController.updateStudentPassword
);

/**
 * @route PATCH /api/auth/student/update-name
 * @description Update the name for a student
 * @access Private (Student)
 */
router.patch(
  "/student/update-name",
  isLogin,
  isEmailVerified,
  isStudent,
  validateUpdateName,
  authController.updateStudentName
);

/**
 * @route POST /api/auth/student/upload-image
 * @description Upload a profile image for a student
 * @access Private (Student)
 */
router.post(
  "/student/upload-image",
  isLogin,
  isEmailVerified,
  isStudent,
  uploadProfile.single("profileImage"),
  authController.uploadStudentImage
);

/**
 * @route GET /api/auth/student/:id
 * @description Get information about a specific student
 * @access Private (Logged-in users only)
 */
router.get(
  "/student/:id",
  isLogin,
  isEmailVerified,
  authController.getStudentInfo
);

/**
 * @route POST /api/auth/student/register-face
 * @description Register a student's face for facial recognition
 * @access Private (Student)
 */
router.post(
  "/student/register-face",
  isLogin,
  isEmailVerified,
  isStudent,
  uploadFaceBiometricData.single("face_image"),
  authController.registerStudentFace
);

/**
 * @route POST /api/auth/student/verify-face
 * @description Verify a student's face using facial recognition
 * @access Private (Student)
 */
router.post(
  "/student/verify-face",
  uploadFaceBiometricData.single("face_image"), // Handle face image upload
  isLogin,
  isEmailVerified,
  isStudent,
  authController.verifyStudentFace
);

// --- Teacher Specific Routes (require authentication and teacher role) ---

/**
 * @route PATCH /api/auth/teacher/update-password
 * @description Update the password for a teacher
 * @access Private (Teacher)
 */
router.patch(
  "/teacher/update-password",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateUpdatePassword,
  authController.updateTeacherPassword
);

/**
 * @route PATCH /api/auth/teacher/update-name
 * @description Update the name for a teacher
 * @access Private (Teacher)
 */
router.patch(
  "/teacher/update-name",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateUpdateName,
  authController.updateTeacherName
);

/**
 * @route POST /api/auth/teacher/upload-image
 * @description Upload a profile image for a teacher
 * @access Private (Teacher)
 */
router.post(
  "/teacher/upload-image",
  isLogin,
  isEmailVerified,
  isTeacher,
  uploadProfile.single("profileImage"),
  authController.uploadTeacherImage
);

/**
 * @route GET /api/auth/teacher/:id
 * @description Get information about a specific teacher
 * @access Private (Logged-in users only)
 */
router.get(
  "/teacher/:id",
  isLogin,
  isEmailVerified,
  authController.getTeacherInfo
);

/**
 * @route POST /api/auth/forget-password
 * @description Forget password
 * @access Public
 */
router.post("/forget-password", authController.forgetPassword);

/**
 * @route POST /api/auth/reset-password
 * @description Reset the password using a token
 * @access Public
 */
router.post(
  "/reset-password",
  validateResetPassword, // A middleware to validate the request body
  authController.resetPassword
);


module.exports = router;

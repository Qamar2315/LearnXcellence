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
} = require("../middlewares/schemaValidator");

// Middleware for authentication and authorization
const { isLogin } = require("../middlewares/isLogin");
const { isStudent, isTeacher } = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

// Middleware for handling file uploads (using multer)
const { uploadProfile } = require("../middlewares/multer/uploadProfile");
const { uploadFaceBiometricData } = require("../middlewares/multer/uploadFace");

// --- Public Routes ---

// Register a new student
router.post("/register", validateRegister, authController.registerStudent);

// Login an existing student
router.post("/login", validateLogin, authController.loginStudent);

// Register a new teacher
router.post(
  "/teacher/register",
  validateRegister,
  authController.registerTeacher
);

// Login an existing teacher
router.post("/teacher/login", validateLogin, authController.loginTeacher);

// --- Protected Routes (require authentication) ---

// Generate OTP (One-Time Password)
router.post("/generate-otp", isLogin, authController.generateOtp);

// Verify OTP
router.post("/verify-otp", isLogin, validateOtp, authController.verifyOtp);

// --- Student Specific Routes (require authentication and student role) ---

// Update student password
router.patch(
  "/student/update-password",
  isLogin,
  isEmailVerified,
  isStudent,
  validateUpdatePassword,
  authController.updateStudentPassword
);

// Update student name
router.patch(
  "/student/update-name",
  isLogin,
  isEmailVerified,
  isStudent,
  validateUpdateName,
  authController.updateStudentName
);

// Upload student profile image
router.post(
  "/student/upload-image",
  isLogin,
  isEmailVerified,
  isStudent,
  uploadProfile.single("profileImage"),
  authController.uploadStudentImage
);

// Get student information (accessible by anyone)
router.get(
  "/student/:id",
  isLogin,
  isEmailVerified,
  authController.getStudentInfo
);

// Register student's face for facial recognition
router.post(
  "/student/register-face",
  isLogin,
  isEmailVerified,
  isStudent,
  uploadFaceBiometricData.single("face_image"),
  authController.registerStudentFace
);

// Verify student's face using facial recognition
router.post(
  "/student/verify-face",
  uploadFaceBiometricData.single("face_image"), // Handle face image upload
  isLogin,
  isEmailVerified,
  isStudent,
  authController.verifyStudentFace
);

// --- Teacher Specific Routes (require authentication and teacher role) ---

// Update teacher password
router.patch(
  "/teacher/update-password",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateUpdatePassword,
  authController.updateTeacherPassword
);

// Update teacher name
router.patch(
  "/teacher/update-name",
  isLogin,
  isEmailVerified,
  isTeacher,
  validateUpdateName,
  authController.updateTeacherName
);

// Upload teacher profile image
router.post(
  "/teacher/upload-image",
  isLogin,
  isEmailVerified,
  isTeacher,
  uploadProfile.single("profileImage"),
  authController.uploadTeacherImage
);

// Get teacher information (accessible by anyone)
router.get(
  "/teacher/:id",
  isLogin,
  isEmailVerified,
  authController.getTeacherInfo
);

module.exports = router;

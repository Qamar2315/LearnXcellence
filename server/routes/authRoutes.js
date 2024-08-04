const express = require("express");
const router = express.Router();

// body validator middlewares
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validateUpdateName,
  validateOtp,
} = require("../middlewares/schemaValidator");
// auth controller
const authController = require("../controllers/authController");
const { isLogin } = require("../middlewares/isLogin");
const { isStudent, isTeacher } = require("../middlewares/authorization");
const { uploadProfile } = require("../middlewares/multer/uploadProfile");
const { uploadFaceBiometricData } = require("../middlewares/multer/uploadFace");
const { isEmailVerified } = require("../middlewares/isEmailVerified");

router.route("/generate-otp").post(isLogin, authController.generateOtp);

router
  .route("/verify-otp")
  .post(isLogin, validateOtp, authController.verifyOtp);

router
  .route("/register")
  .post(validateRegister, authController.registerStudent);

router.route("/login").post(validateLogin, authController.loginStudent);

router
  .route("/teacher/register")
  .post(validateRegister, authController.registerTeacher);

router.route("/teacher/login").post(validateLogin, authController.loginTeacher);

router
  .route("/student/update-password")
  .patch(
    isLogin,
    isEmailVerified,
    isStudent,
    validateUpdatePassword,
    authController.updateStudentPassword
  );

router
  .route("/student/update-name")
  .patch(
    isLogin,
    isEmailVerified,
    isStudent,
    validateUpdateName,
    authController.updateStudentName
  );

router
  .route("/teacher/update-password")
  .patch(
    isLogin,
    isEmailVerified,
    isTeacher,
    validateUpdatePassword,
    authController.updateTeacherPassword
  );

router
  .route("/teacher/update-name")
  .patch(
    isLogin,
    isEmailVerified,
    isTeacher,
    validateUpdateName,
    authController.updateTeacherName
  );

router
  .route("/student/upload-image")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    uploadProfile.single("profileImage"),
    authController.uploadStudentImage
  );

router
  .route("/teacher/upload-image")
  .post(
    isLogin,
    isEmailVerified,
    isTeacher,
    uploadProfile.single("profileImage"),
    authController.uploadTeacherImage
  );

router
  .route("/student/:id")
  .get(isLogin, isEmailVerified, authController.getStudentInfo);

router
  .route("/teacher/:id")
  .get(isLogin, isEmailVerified, authController.getTeacherInfo);

router
  .route("/student/register-face")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    uploadFaceBiometricData.single("face_image"),
    authController.registerStudentFace
  );

router
  .route("/student/verify-face")
  .post(
    uploadFaceBiometricData.single("face_image"),
    isLogin,
    isStudent,
    isEmailVerified,
    authController.verifyStudentFace
  );

module.exports = router;

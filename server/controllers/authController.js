const asyncHandler = require("../utilities/CatchAsync");
const authService = require("../services/authService");
const AppError = require("../utilities/AppError");

const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, pass } = req.body;
  const student = await authService.registerStudent(name, email, pass);
  res.status(201).json(student);
});

const loginStudent = asyncHandler(async (req, res) => {
  const { email, pass } = req.body;
  const student = await authService.loginStudent(email, pass);
  res.status(200).json(student);
});

const registerTeacher = asyncHandler(async (req, res) => {
  const { name, email, pass } = req.body;
  const teacher = await authService.registerTeacher(name, email, pass);
  res.status(201).json(teacher);
});

const loginTeacher = asyncHandler(async (req, res) => {
  const { email, pass } = req.body;
  const teacher = await authService.loginTeacher(email, pass);
  res.status(200).json(teacher);
});

const updateStudentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const studentId = req.user._id;
  const updatedStudent = await authService.updateStudentPassword(
    studentId,
    currentPassword,
    newPassword
  );
  res.status(200).json(updatedStudent);
});

const updateStudentName = asyncHandler(async (req, res) => {
  const { newName } = req.body;
  const studentId = req.user._id;
  const updatedStudent = await authService.updateStudentName(
    studentId,
    newName
  );
  res.status(200).json(updatedStudent);
});

const updateTeacherPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const teacherId = req.user._id;
  const updatedTeacher = await authService.updateTeacherPassword(
    teacherId,
    currentPassword,
    newPassword
  );
  res.status(200).json(updatedTeacher);
});

const updateTeacherName = asyncHandler(async (req, res) => {
  const { newName } = req.body;
  const teacherId = req.user._id;
  const updatedTeacher = await authService.updateTeacherName(
    teacherId,
    newName
  );
  res.status(200).json(updatedTeacher);
});

const getStudentInfo = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const studentInfo = await authService.getStudentInfo(studentId);
  res.status(200).json(studentInfo);
});

const getTeacherInfo = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  const teacherInfo = await authService.getTeacherInfo(teacherId);
  res.status(200).json(teacherInfo);
});

const uploadStudentImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }
  const studentId = req.user._id;
  const imageName = req.file.filename;

  const student = await authService.uploadStudentImage(studentId, imageName);
  res.status(200).json(student);
});

const uploadTeacherImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }
  const teacherId = req.user._id;
  const imageName = req.file.filename;

  const teacher = await authService.uploadTeacherImage(teacherId, imageName);
  res.status(200).json(teacher);
});

const generateOtp = asyncHandler(async (req, res) => {
  const account_id = req.user.account;
  const otp = await authService.generateOtp(account_id); // Call service to generate OTP and send it
  if (!otp) {
    throw new AppError("Failed to generate OTP", 404);
  }
  res.status(200).json({ message: "OTP sent successfully" });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const account_id = req.user.account;
  await authService.verifyOtp(account_id, otp); // Call service to verify OTP and update the account
  res.status(200).json({ message: "Email verified successfully" });
});

const registerStudentFace = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }
  const studentId = req.user._id; // Assuming you have middleware to authenticate and set req.user
  const imagePath = req.file.path; // Path of the uploaded image

  await authService.registerStudentFace(studentId, imagePath);
  res
    .status(200)
    .json({ success: true, message: "Face data registered successfully" });
});

const verifyStudentFace = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image");
  }
  const studentId = req.user._id; // Assuming `req.user` is set by authentication middleware
  const imagePath = req.file.path; // Path of the uploaded image
  const encoding = req.user.face_biometric_data;
  const result = await authService.verifyStudentFace(
    studentId,
    imagePath,
    encoding
  );
  res.status(200).json(result);
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Email not found", 404);
  }
  await authService.forgetPassword(email);
  res.status(200).json({ message: "Password reset link sent to your email" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body; // Get token and newPassword from the request body
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    throw new AppError("Not Authorized, No Token", 401);
  }
  const updatedAccount = await authService.resetPassword(token, newPassword); // Call the service to update the password

  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = {
  registerStudent,
  loginStudent,
  registerTeacher,
  loginTeacher,
  updateStudentPassword,
  updateStudentName,
  updateTeacherPassword,
  updateTeacherName,
  getStudentInfo,
  getTeacherInfo,
  uploadStudentImage,
  uploadTeacherImage,
  generateOtp,
  verifyOtp,
  registerStudentFace,
  verifyStudentFace,
  forgetPassword,
  resetPassword,
};

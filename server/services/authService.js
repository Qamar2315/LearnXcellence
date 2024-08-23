const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const AppError = require("../utilities/AppError");
const generateToken = require("../utilities/GetToken");
const axios = require("axios");
const {
  verifyStudentEmail,
  verifyTeacherEmail,
} = require("../utilities/MailVerification");
const { deleteFile } = require("../utilities/removeFile");
const notificationService = require("../services/notificationService");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
require("dotenv").config();

const registerStudent = async (name, email, pass) => {
  if (!name || !email || !pass) {
    throw new AppError("Enter all the required fields", 400);
  }
  if (!verifyStudentEmail(email)) {
    throw new AppError("This Is Not A Student Email", 400);
  }
  const account = await authRepository.findAccountByEmail(email);
  if (account) {
    const studentExists = await authRepository.findStudentByAccountId(
      account._id
    );
    if (studentExists) {
      throw new AppError("Student Already Registered", 400);
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);
  const studentAccount = await authRepository.createAccount(
    email,
    hashedPassword
  );
  const student = await authRepository.createStudent(name, studentAccount._id);
  await notificationService.createNotification(
    {
      title: "Welcome to the Student Portal",
      content: "You have successfully registered as a student",
      read: false,
    },
    studentAccount._id
  );
  return {
    _id: student._id,
    name: student.name,
    email: studentAccount.email,
    password: studentAccount.password,
    token: generateToken(student._id),
  };
};

const loginStudent = async (email, pass) => {
  if (!verifyStudentEmail(email)) {
    throw new AppError("This Is Not A Student Email", 400);
  }
  const studentAccount = await authRepository.findAccountByEmail(email);
  if (!studentAccount) {
    throw new AppError("Student Account Not Found", 400);
  }
  const isMatch = await bcrypt.compare(pass, studentAccount.password);
  if (!isMatch) {
    throw new AppError("Wrong Email Or Password", 400);
  }
  const student = await authRepository.findStudentByAccountId(
    studentAccount._id
  );
  return {
    _id: student._id,
    name: student.name,
    email: studentAccount.email,
    token: generateToken(student._id),
  };
};

const registerTeacher = async (name, email, pass) => {
  if (!name || !email || !pass) {
    throw new AppError("Enter all the required fields", 400);
  }
  if (!verifyTeacherEmail(email)) {
    throw new AppError("This Is Not A Faculty Email", 400);
  }
  const account = await authRepository.findAccountByEmail(email);
  if (account) {
    const teacherExists = await authRepository.findTeacherByAccountId(
      account._id
    );
    if (teacherExists) {
      throw new AppError("Teacher Already Registered", 400);
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);
  const teacherAccount = await authRepository.createAccount(
    email,
    hashedPassword
  );
  const teacher = await authRepository.createTeacher(name, teacherAccount._id);
  await notificationService.createNotification(
    {
      title: "Welcome to the Faculty Portal",
      content: "You have successfully registered as a teacher",
      read: false,
    },
    teacherAccount._id
  );
  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacherAccount.email,
    password: teacherAccount.password,
    token: generateToken(teacher._id),
  };
};

const loginTeacher = async (email, pass) => {
  if (!verifyTeacherEmail(email)) {
    throw new AppError("This Is Not A Faculty Email", 400);
  }
  const teacherAccount = await authRepository.findAccountByEmail(email);
  if (!teacherAccount) {
    throw new AppError("Teacher Account Not Found", 400);
  }
  const isMatch = await bcrypt.compare(pass, teacherAccount.password);
  if (!isMatch) {
    throw new AppError("Wrong Email Or Password", 400);
  }
  const teacher = await authRepository.findTeacherByAccountId(
    teacherAccount._id
  );
  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacherAccount.email,
    token: generateToken(teacher._id),
  };
};

const updateStudentPassword = async (
  studentId,
  currentPassword,
  newPassword
) => {
  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student Not Found", 404);
  }

  const studentAccount = await authRepository.findAccountById(student.account);
  const isMatch = await bcrypt.compare(
    currentPassword,
    studentAccount.password
  );
  if (!isMatch) {
    throw new AppError("Incorrect Current Password", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  studentAccount.password = hashedNewPassword;
  await studentAccount.save();

  return { message: "Password Updated Successfully" };
};

const updateStudentName = async (studentId, newName) => {
  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student Not Found", 404);
  }

  student.name = newName;
  await student.save();

  return {
    _id: student._id,
    name: student.name,
    email: student.account.email,
  };
};

const updateTeacherPassword = async (
  teacherId,
  currentPassword,
  newPassword
) => {
  const teacher = await authRepository.findTeacherById(teacherId);
  if (!teacher) {
    throw new AppError("Teacher Not Found", 404);
  }

  const teacherAccount = await authRepository.findAccountById(teacher.account);
  const isMatch = await bcrypt.compare(
    currentPassword,
    teacherAccount.password
  );
  if (!isMatch) {
    throw new AppError("Incorrect Current Password", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  teacherAccount.password = hashedNewPassword;
  await teacherAccount.save();

  return { message: "Password Updated Successfully" };
};

const updateTeacherName = async (teacherId, newName) => {
  const teacher = await authRepository.findTeacherById(teacherId);
  if (!teacher) {
    throw new AppError("Teacher Not Found", 404);
  }

  teacher.name = newName;
  await teacher.save();

  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacher.account.email,
  };
};

const getStudentInfo = async (studentId) => {
  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }
  return {
    _id: student._id,
    name: student.name,
    email: student.account.email,
    profile_picture: student.account.profile_picture,
  };
};

const getTeacherInfo = async (teacherId) => {
  const teacher = await authRepository.findTeacherById(teacherId);
  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }
  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacher.account.email,
  };
};

const uploadStudentImage = async (studentId, imageName) => {
  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }
  const studentAccount = await authRepository.findAccountById(student.account);
  if (studentAccount.profile_picture) {
    deleteFile(studentAccount.profile_picture);
  }
  studentAccount.profile_picture = imageName;
  await studentAccount.save();
  student.account = studentAccount;
  return student;
};

const uploadTeacherImage = async (teacherId, imageName) => {
  const teacher = await authRepository.findTeacherById(teacherId);
  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  if (teacherAccount.profile_picture) {
    deleteFile(teacherAccount.profile_picture);
  }
  teacherAccount.profile_picture = imageName;
  await teacherAccount.save();
  teacher.account = teacherAccount;
  return teacher;
};

const generateOtp = async (account_id) => {
  const account = await authRepository.findAccountById(account_id);

  if (!account) {
    throw new AppError("Account Not Found ", 400);
  }
  if (account.email_verified) {
    throw new AppError("Email Already Verified", 400);
  }
  if (account && account.otp) {
    const existingOtp = account.otp;
    const now = new Date();
    const otpCreatedAt = new Date(existingOtp.createdAt);
    const expiryTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if the existing OTP is still valid
    if (now - otpCreatedAt < expiryTime) {
      return existingOtp.otp; // Return the existing valid OTP
    }

    // If the existing OTP is expired, delete it
    await authRepository.deleteOtp(existingOtp._id);
    account.otp = null;
    await account.save();
  }

  // Call Flask API to generate a new OTP if necessary
  const response = await axios.post(`${process.env.FLASK_URL}/generate-otp`, {
    email: account.email,
  });
  if (!response.data.success) {
    throw new Error("Failed to generate OTP from Flask API");
  }
  const otp = response.data.otp;
  // Save the new OTP in the database
  const newOtp = await authRepository.createNewOtp(otp);

  // Associate the new OTP with the account
  if (account) {
    account.otp = newOtp._id;
    await account.save();
  } else {
    throw new AppError("Account not found", 404);
  }
  return newOtp.otp;
};

const verifyOtp = async (account_id, otp) => {
  const account = await authRepository.findAccountById(account_id);
  if (account.email_verified) {
    throw new AppError("Email Already Verified", 400);
  }
  if (!account) {
    throw new AppError("Account not found", 404);
  }

  if (!account.otp) {
    throw new AppError("No OTP associated with this account", 400);
  }

  const existingOtp = account.otp;
  const now = new Date();
  const otpCreatedAt = new Date(existingOtp.createdAt);
  const expiryTime = 30 * 60 * 1000; // 30 minutes in milliseconds

  if (existingOtp.otp !== parseInt(otp, 10)) {
    throw new AppError("Invalid OTP", 400);
  }

  if (now - otpCreatedAt >= expiryTime) {
    throw new AppError("Expired OTP", 400);
  }

  // OTP is valid, proceed with email verification
  await authRepository.updateAccountEmailVerification(account_id, true);
  await authRepository.deleteOtp(existingOtp._id);
  await authRepository.setAccountOtpToNull(account._id);

  return { success: true, message: "Email verified successfully" };
};

const registerStudentFace = async (studentId, imagePath) => {
  const student = await authRepository.findStudentById(studentId);
  // console.log(student)
  if (!student) {
    throw new AppError("Student Not Found", 404);
  }
  // Call Flask API to get face encoding
  const response = await axios.post(`${process.env.FLASK_URL}/register-face`, {
    image_path: imagePath,
  });
  if (!response.data.success) {
    throw new AppError(response.data.error, 400);
  }
  // Save face encoding to student document
  student.face_biometric_data = response.data.encoding;
  await student.save();
  deleteFileByPath(imagePath);
};

const verifyStudentFace = async (studentId, imagePath, encoding) => {
  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student Not Found", 404);
  }
  // Call Flask API for face verification
  const response = await axios.post(`${process.env.FLASK_URL}/verify-face`, {
    image_path: imagePath,
    known_face_encoding: encoding,
  });
  deleteFileByPath(imagePath);
  if (!response.data.success) {
    throw new AppError(response.data.error, 400);
  }
  // console.log(response.data)
  const { success, match } = response.data;

  if (success) {
    return { success, match };
  } else {
    throw new AppError("Face not matched", 400);
  }
};

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
};

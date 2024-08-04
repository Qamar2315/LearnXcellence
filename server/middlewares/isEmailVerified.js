const asyncHandler = require("../utilities/CatchAsync");
const AppError = require("../utilities/AppError");
const authRepository = require("../repositories/authRepository");

const isEmailVerified = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming `req.user` is set by authentication middleware

  // First, check if the user is a student
  let student = await authRepository.findStudentById(userId);
  if (student) {
    const account = await authRepository.findAccountById(student.account);
    if (!account) {
      return next(new AppError("Account not found", 404));
    }
    if (!account.email_verified) {
      return next(new AppError("Email not verified", 403));
    }
    return next(); // Proceed if the email is verified
  }

  // If not a student, check if the user is a teacher
  let teacher = await authRepository.findTeacherById(userId);
  if (teacher) {
    const account = await authRepository.findAccountById(teacher.account);
    if (!account) {
      return next(new AppError("Account not found", 404));
    }
    if (!account.email_verified) {
      return next(new AppError("Email not verified", 403));
    }
    return next(); // Proceed if the email is verified
  }

  // If not a student or teacher
  return next(new AppError("User not found", 404));
});

module.exports = { isEmailVerified };

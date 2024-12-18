const asyncHandler = require("../utilities/CatchAsync");
const AppError = require("../utilities/AppError");
const proctoringService = require("../services/proctoringService");
const authRepository = require("../repositories/authRepository");
const notificationService = require("../services/notificationService");
const path = require('path');

const analyzeImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please provide an image", 400);
  }

  const studentId = req.user._id; // Get the student ID from the authenticated user
  const quizId = req.params.quizId; // Get the quiz ID from the route parameters
  const imagePath = req.file.path; // Path of the uploaded image

  // Check if the quiz submission exists and is within the allowed time frame
  const result = await proctoringService.analyzeImage(
    studentId,
    quizId,
    imagePath
  );

  res.status(200).json(result);
});

const generateReport = asyncHandler(async (req, res) => {
  const { courseId, quizId, studentId } = req.params;
  const teacherId = req.user._id; // Get the teacher ID from the authenticated user
  // Generate PDF report
  const pdfBuffer = await proctoringService.generatePdfReport(
    courseId,
    quizId,
    studentId
  );
  const teacher = await authRepository.findTeacherById(teacherId);
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  const student = await authRepository.findStudentById(studentId);
  await notificationService.createNotification(
    {
      title: "Proctoring Report Generated",
      message: `Proctoring report has been generated for student ${student.name}`,
      read: false,
    },
    teacherAccount._id
  );

  // Send the generated PDF as a response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=report_${studentId}.pdf`
  );
  res.send(pdfBuffer);
});

// const generateReport = asyncHandler(async (req, res) => {
//   const { courseId, quizId, studentId } = req.params;
//   const teacherId = req.user._id; // Get the teacher ID from the authenticated user

//   // Generate PDF report
//   const uniqueId = await proctoringService.generatePdfReport(
//     courseId,
//     quizId,
//     studentId
//   );

//   // Notify teacher (optional)
//   const teacher = await authRepository.findTeacherById(teacherId);
//   const teacherAccount = await authRepository.findAccountById(teacher.account);
//   const student = await authRepository.findStudentById(studentId);
//   await notificationService.createNotification(
//     {
//       title: "Proctoring Report Generated",
//       message: `Proctoring report has been generated for student ${student.name}`,
//       read: false,
//     },
//     teacherAccount._id
//   );

//   // Construct the file path
//   const filePath = path.join(
//     __dirname,
//     "../uploads/reports",
//     `${uniqueId}.pdf`
//   );

//   // Send the file as a response
//   res.download(filePath, `report_${studentId}.pdf`, (err) => {
//     if (err) {
//       console.error("Error sending the file:", err);
//       res.status(500).send("Failed to download the report.");
//     }
//   });
// });

module.exports = {
  analyzeImage,
  generateReport,
};

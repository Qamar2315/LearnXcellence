const asyncHandler = require("../utilities/CatchAsync");
const quizService = require("../services/quizService");
const AppError = require("../utilities/AppError");
const path = require("path");

const createQuiz = asyncHandler(async (req, res) => {
  const { title, topic, questions, deadline, duration, number_of_questions } =
    req.body;
  const { courseId } = req.params;
  const quiz = await quizService.createQuiz(
    courseId,
    title,
    topic,
    questions,
    deadline,
    duration,
    number_of_questions
  );
  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: {
      quiz,
    },
  });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const { title, topic, questions, deadline, duration, number_of_questions } =
    req.body;
  const { id } = req.params;
  const quiz = await quizService.updateQuiz(
    id,
    title,
    topic,
    questions,
    deadline,
    duration,
    number_of_questions
  );
  res.status(200).json({
    success: true,
    message: "Quiz updated successfully",
    data: { quiz },
  });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const { id, courseId } = req.params;
  await quizService.deleteQuiz(id, courseId);
  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
  });
});

const getQuiz = asyncHandler(async (req, res) => {
  const { id, courseId } = req.params;
  const quiz = await quizService.getQuiz(id, courseId);
  res.status(200).json(quiz);
});

const getQuizStudent = asyncHandler(async (req, res) => {
  const { id, courseId } = req.params;
  const quiz = await quizService.getQuizStudent(id, courseId);
  res.status(200).json(quiz);
});

const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const quizzes = await quizService.getQuizzesByCourse(courseId);
  res.status(200).json(quizzes);
});

const startQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user._id;
  const submission = await quizService.startQuiz(id, studentId);
  res.status(200).json({
    success: true,
    message: "Quiz started successfully",
    data: submission,
  });
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user._id;
  const { answers } = req.body;
  const submission = await quizService.submitQuiz(id, studentId, answers);
  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    data: { submission },
  });
});

const updateSubmissionMarks = asyncHandler(async (req, res) => {
  const { courseId, quizId, submissionId } = req.params;
  const { newScore } = req.body;
  const submission = await quizService.updateSubmissionMarks(
    courseId,
    quizId,
    submissionId,
    newScore
  );
  res.status(200).json({
    success: true,
    message: "Quiz submission marks updated successfully",
    data: { submission },
  });
});

// Update the isFlagged status of a submission
const updateSubmissionFlag = asyncHandler(async (req, res) => {
  const { courseId, quizId, submissionId } = req.params;
  const { isFlagged } = req.body;

  // Call the service to update the flag status
  const updatedSubmission = await quizService.updateSubmissionFlag(
    courseId,
    quizId,
    submissionId,
    isFlagged
  );

  res.status(200).json({
    success: true,
    message: "Submission flag status updated successfully",
    data: {
      submission: updatedSubmission,
    },
  });
});

const generateQuizByTopic = asyncHandler(async (req, res) => {
  const { topic, numberOfQuestions, difficulty } = req.query; // Get parameters from query string

  if (!topic) {
    throw new AppError("Topic is required in the query string.", 400);
  }

  const generatedQuestions = await quizService.generateQuestionsByTopic(
    topic,
    numberOfQuestions,
    difficulty
  );

  res.status(200).json({
    success: true,
    message: "Quiz questions generated successfully",
    data: generatedQuestions,
  });
});

const generateQuizByTopicOrContent = asyncHandler(async (req, res) => {
  const { topic, numberOfQuestions, difficulty, content } = req.body;

  let generatedQuestions = await quizService.generateQuestionsByContent(
    topic,
    content,
    numberOfQuestions,
    difficulty
  );

  res.status(200).json({
    success: true,
    message: "Quiz questions generated successfully",
    data: generatedQuestions,
  });
});

// Controller Function to Handle Request
// const generatePDFStudent = asyncHandler(async (req, res) => {
//   try {
//     const { courseId, id, studentId } = req.params;
//     const pdfBuffer = await quizService.generatePDFStudent(
//       courseId,
//       id,
//       studentId
//     );

//     // Set Response Headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=report_${studentId}.pdf`
//     );

//     // Send the PDF Buffer
//     res.send(pdfBuffer);
//   } catch (error) {
//     // Handle Errors Appropriately
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "An error occurred while generating the PDF",
//     });
//   }
// });

const generatePDFStudent = asyncHandler(async (req, res) => {
  const { courseId, id, studentId } = req.params;
  const uniqueId = await quizService.generatePDFStudentSingle(
    courseId,
    id,
    studentId
  );

  // Construct the file path
  const filePath = path.join(
    __dirname,
    "../uploads/quizzes",
    `${uniqueId}.pdf`
  );

  // Send the file as a response
  res.download(filePath, `report_${studentId}.pdf`, (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(500).send("Failed to download the report.");
    }
  });
});

const generatePDFAllStudents = asyncHandler(async (req, res) => {
  try {
    const { courseId, id } = req.params;

    // Use the service function to generate PDFs and create a zip file
    const zipBuffer = await quizService.generatePDFForAllStudents(courseId, id);

    // Set Response Headers for the zip file
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quizes_${id}.zip`
    );

    // Send the Zip file
    res.send(zipBuffer);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An error occurred while generating the PDFs",
    });
  }
});

const getAllQuizSubmissions = asyncHandler(async (req, res) => {
  const { courseId, quizId } = req.params;
  const submissions = await quizService.getAllSubmissionsForQuiz(
    courseId,
    quizId
  );
  res.status(200).json(submissions);
});

const getStudentSubmission = asyncHandler(async (req, res) => {
  const { courseId, quizId } = req.params;
  const studentId = req.user._id;

  const submission = await quizService.getSubmissionForStudent(
    courseId,
    quizId,
    studentId
  );
  res.status(200).json(submission);
});

const getStudentSubmissionForTeacher = asyncHandler(async (req, res) => {
  const { courseId, quizId, submissionId } = req.params;
  const teacherId = req.user._id;
  const submission = await quizService.getSubmissionForTeacher(
    courseId,
    quizId,
    submissionId,
    teacherId
  );
  res.status(200).json(submission);
});

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
  getQuizStudent,
  startQuiz,
  submitQuiz,
  updateSubmissionMarks,
  updateSubmissionFlag,
  generateQuizByTopic,
  generateQuizByTopicOrContent,
  generatePDFStudent,
  generatePDFAllStudents,
  getAllQuizSubmissions,
  getStudentSubmission,
  getStudentSubmissionForTeacher,
};

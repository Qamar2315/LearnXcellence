const asyncHandler = require("../utilities/CatchAsync");
const quizService = require("../services/quizService");

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


module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
  getQuizStudent,
  startQuiz,
  submitQuiz,
};

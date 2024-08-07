const asyncHandler = require("../utilities/CatchAsync");
const quizService = require("../services/quizService");

const createQuiz = asyncHandler(async (req, res) => {
  const { title, topic, questions, deadline } = req.body;
  const { courseId } = req.params;
  const quiz = await quizService.createQuiz(courseId, title, topic, questions, deadline);
  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: {
      quiz,
    },
  });
});

const updateQuiz = asyncHandler(async (req, res) => {
    const { title, topic, questions, deadline } = req.body;
    const { id } = req.params;
    const quiz = await quizService.updateQuiz(id, title, topic, questions, deadline);
    res.status(200).json({
        success: true,
        message: "Quiz updated successfully",
        data: { quiz },
    });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const { id,courseId } = req.params;
  await quizService.deleteQuiz(id,courseId);
  res.status(200).json(
    {
      success:true,
      message:"Quiz deleted successfully"
    }
  )
});

const getQuiz = asyncHandler(async (req, res) => {
  const { id, courseId } = req.params;
  const quiz = await quizService.getQuiz(id,courseId);
  res.status(200).json(quiz);
});

const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const quizzes = await quizService.getQuizzesByCourse(courseId);
  res.status(200).json(quizzes);
});

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
};

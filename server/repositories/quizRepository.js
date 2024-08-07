const Quiz = require("../models/Quiz");

// Create a new quiz
const createQuiz = async (quizData) => {
  return await Quiz.create(quizData);
};

const getQuizById = async (quizId) => {
  return await Quiz.findById(quizId);
};

// Find a quiz by its ID
const findQuizById = async (quizId) => {
  return await Quiz.findById(quizId).populate("questions");
};

const getQuizzesByCourse = async (courseId) => {
  return await Quiz.find({ course: courseId });
};

// Update a quiz by its ID
const updateQuizById = async (quizId, updateData) => {
  return await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
};

// Delete a quiz by its ID
const deleteQuizById = async (quizId) => {
  return await Quiz.findByIdAndDelete(quizId);
};

module.exports = {
  createQuiz,
  findQuizById,
  updateQuizById,
  deleteQuizById,
  getQuizById,
  getQuizzesByCourse,
};

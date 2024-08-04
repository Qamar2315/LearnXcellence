const Quiz = require('../models/Quiz');

const createQuiz = (quizData) => Quiz.create(quizData);

const updateQuiz = (id, updates) => Quiz.findByIdAndUpdate(id, updates, { new: true });

const deleteQuiz = (id) => Quiz.findByIdAndDelete(id);

const getQuiz = (id) => Quiz.findById(id).populate('questions');

const getQuizzesByCourse = (courseId) => Quiz.find({ course: courseId }).populate('questions');

module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    getQuizzesByCourse,
};

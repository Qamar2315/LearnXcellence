const quizRepository = require('../repositories/quizRepository');
const AppError = require('../utilities/AppError');

const createQuiz = async (course, teacher, student, title, topic, tags, questions) => {
    if (!course || !teacher || !title) {
        throw new AppError("Course, Teacher, and Title are required fields", 400);
    }
    const quiz = await quizRepository.createQuiz({ course, teacher, student, title, topic, tags, questions });
    return quiz;
};

const updateQuiz = async (id, updates) => {
    const quiz = await quizRepository.updateQuiz(id, updates);
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }
    return quiz;
};

const deleteQuiz = async (id) => {
    const result = await quizRepository.deleteQuiz(id);
    if (!result) {
        throw new AppError("Quiz not found", 404);
    }
};

const getQuiz = async (id) => {
    const quiz = await quizRepository.getQuiz(id);
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }
    return quiz;
};

const getQuizzesByCourse = async (courseId) => {
    const quizzes = await quizRepository.getQuizzesByCourse(courseId);
    return quizzes;
};

module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    getQuizzesByCourse,
};

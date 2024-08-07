const Question = require('../models/Question');

// Find a question by its content
const findQuestionByContent = async (content) => {
    return await Question.findOne({ content });
};

// Create a new question
const createQuestion = async (questionData) => {
    return await Question.create(questionData);
};

module.exports = {
    findQuestionByContent,
    createQuestion,
};

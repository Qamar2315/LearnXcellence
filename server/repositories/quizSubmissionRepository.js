const QuizSubmission = require('../models/QuizSubmission');

const createSubmission = async (submissionData) => {
    return await QuizSubmission.create(submissionData);
};

const findSubmission = async (quizId, studentId) => {
    return await QuizSubmission.findOne({ quiz: quizId, student: studentId });
};

module.exports = {
    createSubmission,
    findSubmission,
};

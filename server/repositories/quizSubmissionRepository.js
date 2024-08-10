const QuizSubmission = require('../models/QuizSubmission');

const createSubmission = async (submissionData) => {
    return await QuizSubmission.create(submissionData);
};

const findSubmission = async (quizId, studentId) => {
    return await QuizSubmission.findOne({ quiz: quizId, student: studentId });
};

const findSubmissionById= async (submissionId)=>{
    return await QuizSubmission.findById(submissionId);
}
module.exports = {
    createSubmission,
    findSubmission,
    findSubmissionById
};

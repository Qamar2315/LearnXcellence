const QuizSubmission = require("../models/QuizSubmission");

const createSubmission = async (submissionData) => {
  return await QuizSubmission.create(submissionData);
};

const getAllQuizSubmissions = async (quizId) => {
  return await QuizSubmission.find({ quiz: quizId }).populate({
    path: "student",
    select: "name account", // Select the fields you need from the Student model
    populate: { path: "account", select: "email profile_picture" },
  });
};

const findSubmissionById = async (submissionId) => {
  return await QuizSubmission.findById(submissionId).populate({
    path: "student",
    select: "name account",
    populate: { path: "account", select: "email profile_picture" },
  });
};

const findSubmission = async (quizId, studentId) => {
  return await QuizSubmission.findOne({
    quiz: quizId,
    student: studentId,
  }).populate({
    path: "student",
    select: "name account",
    populate: { path: "account", select: "email profile_picture" },
  });
};

module.exports = {
  createSubmission,
  findSubmission,
  findSubmissionById,
  getAllQuizSubmissions,
};

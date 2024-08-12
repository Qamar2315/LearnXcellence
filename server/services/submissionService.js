const submissionRepo = require("../repositories/submissionRepository");

const submitAssignment = async (submissionData) => {
  return await submissionRepo.createSubmission(submissionData);
};

const getSubmissions = async (assignmentId) => {
  return await submissionRepo.getSubmissionsByAssignmentId(assignmentId);
};

const getSubmission = async (submissionId) => {
  return await submissionRepo.getSubmissionById(submissionId);
};

module.exports = { submitAssignment, getSubmissions, getSubmission };

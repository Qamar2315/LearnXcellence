const Submission = require("../models/Submission");

const createSubmission = async (submissionData) => {
  const submission = new Submission(submissionData);
  return await submission.save();
};

const getSubmissionsByAssignmentId = async (assignmentId) => {
  return await Submission.find({ assignment: assignmentId }).populate(
    "remarks"
  );
};

const getSubmissionById = async (submissionId) => {
  return await Submission.findById(submissionId).populate("remarks");
};

const deleteSubmissionsByAssignmentId = async (assignmentId) => {
  return await Submission.deleteMany({ assignment: assignmentId });
};

module.exports = {
  createSubmission,
  getSubmissionsByAssignmentId,
  getSubmissionById,
  deleteSubmissionsByAssignmentId,
};

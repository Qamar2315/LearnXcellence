const submissionService = require("../services/submissionService");
const asyncHandler = require("../utilities/CatchAsync");
const path = require("path");

const createSubmission = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  const { courseId, assignmentId } = req.params;
  const document_id = req.file.filename;
  const studentId = req.user._id;
  const submission = await submissionService.addSubmission(
    courseId,
    assignmentId,
    studentId,
    document_id
  );

  res.status(201).json({
    success: true,
    message: "Submission created successfully",
    data: submission,
  });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const submissions = await submissionService.getSubmissionsByAssignment(
    courseId,
    assignmentId
  );
  res.status(200).json(submissions);
});

const getSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const studentId = req.user._id;
  const submission = await submissionService.getSubmission(
    assignmentId,
    submissionId,
    studentId
  );
  res.status(200).json(submission);
});

const updateSubmission = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  const { assignmentId, submissionId } = req.params;
  const document_id = req.file.filename;
  const studentId = req.user._id;

  const updatedSubmission = await submissionService.updateSubmission(
    assignmentId,
    submissionId,
    studentId,
    document_id
  );

  res.status(200).json({
    success: true,
    message: "Submission updated successfully",
    data: updatedSubmission,
  });
});

const deleteSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const studentId = req.user._id;
  await submissionService.deleteSubmission(assignmentId, submissionId, studentId);
  res.status(200).json({ message: "Submission deleted successfully" });
});

const downloadSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const studentId = req.user._id;
  const submission = await submissionService.getSubmission(
    assignmentId,
    submissionId,
    studentId
  );
  res.download(path.join(__dirname, "../uploads", "submissions", submission.document_id));
});

const downloadSubmissionTeacher = asyncHandler(async (req, res) => {
  const { courseId, submissionId } = req.params;
  const submission = await submissionService.getSubmissionTeacher(submissionId);
  res.download(path.join(__dirname, "../uploads", "submissions", submission.document_id));
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  downloadSubmission,
  downloadSubmissionTeacher,
};

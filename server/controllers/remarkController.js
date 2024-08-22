const asyncHandler = require("../utilities/CatchAsync");
const remarkService = require("../services/remarkService");

const addRemarkToViva = asyncHandler(async (req, res) => {
  const { courseId, projectId } = req.params;
  const data = await remarkService.addRemarkToViva(
    courseId,
    projectId,
    req.body
  );
  res.status(201).json({
    success: true,
    message: "Remark Added Successfully",
    data,
  });
});

const updateRemark = asyncHandler(async (req, res) => {
  const { remarkId } = req.params;
  const updatedRemark = await remarkService.updateRemark(remarkId, req.body);
  res.status(201).json({
    success: true,
    message: "updated successfully",
    data: updatedRemark,
  });
});

const sendRemark = asyncHandler(async (req, res) => {
  const { remarkId, projectId, courseId } = req.params;
  const remark = await remarkService.sendRemark(remarkId, projectId, courseId);
  res.status(201).json({
    success: true,
    message: "Remark Sent Successfully",
    data: remark,
  });
});

//For Submissions
const addRemarkToSubmission = asyncHandler(async (req, res) => {
  const { courseId, submissionId } = req.params;
  const data = await remarkService.addRemarkToSubmission(
    courseId,
    submissionId,
    req.body
  );
  res.status(201).json({
    success: true,
    message: "Remark Added Successfully",
    data,
  });
});

const updateSubmissionRemark = asyncHandler(async (req, res) => {
  const { remarkId } = req.params;
  const updatedRemark = await remarkService.updateRemark(remarkId, req.body); // Assuming you reuse the updateRemark service function
  res.status(201).json({
    success: true,
    message: "Remark updated successfully",
    data: updatedRemark,
  });
});

const readSubmissionRemark = asyncHandler(async (req, res) => {
  const { remarkId, submissionId } = req.params;
  const studentId = req.user._id;
  const remark = await remarkService.readSubmissionRemark(
    remarkId,
    submissionId,
    studentId
  );
  res.status(201).json({
    success: true,
    message: "Remark retrieved successfully",
    data: remark,
  });
});

module.exports = {
  addRemarkToViva,
  updateRemark,
  sendRemark,
  addRemarkToSubmission,
  updateSubmissionRemark,
  readSubmissionRemark,
};

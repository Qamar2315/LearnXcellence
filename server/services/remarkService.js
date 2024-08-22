const remarkRepository = require("../repositories/remarksRepository");
const AppError = require("../utilities/AppError");
const vivaRepository = require("../repositories/vivaRepository");
const submissionRepository = require("../repositories/submissionRepository");

const addRemarkToViva = async (classId, projectId, remarkData) => {
  console.log(remarkData);
  const project = await remarkRepository.findProjectByIdAndCourseId(
    projectId,
    classId
  );
  if (!project) {
    throw new AppError("Project Not Found", 400);
  }
  if (project.viva) {
    if (project.viva.status !== "taken") {
      throw new AppError("Can't Add Remark Without Taking Viva", 400);
    }
  } else {
    throw new AppError("Didn't Schedule Viva Yet", 400);
  }
  const viva = await vivaRepository.findVivaById(project.viva._id);
  if (viva.remarks) {
    throw new AppError("Remark Already Added", 400);
  }
  const remark = await remarkRepository.createRemark({
    overallPerformance: remarkData.overallPerformance,
    feedback: remarkData.feedback,
    obtainedMarks: remarkData.obtainedMarks,
    totalMarks: remarkData.totalMarks,
  });
  if (!remark) {
    throw new AppError("Not Saved due To Some Internal Error", 400);
  }
  viva.remarks = remark;
  await remarkRepository.saveViva(viva);
  return viva.remarks;
};

const updateRemark = async (remarkId, updateData) => {
  const checkRemark = await remarkRepository.findRemarkById(remarkId);
  if (!checkRemark) throw new AppError("Remark Not Found", 400);
  const updatedRemark = await remarkRepository.updateRemark(
    remarkId,
    updateData
  );
  return updatedRemark;
};

const sendRemark = async (remarkId, projectId, courseId) => {
  const project = await remarkRepository.findProjectByIdAndCourseId(
    projectId,
    courseId
  );
  if (!project) throw new AppError("Project Not Found", 400);
  const viva = await vivaRepository.findVivaById(project.viva._id);
  if (!viva) throw new AppError("Viva Not Found", 400);
  if (viva.remarks._id.toString() !== remarkId)
    throw new AppError("Remarks not exists on viva of this project", 400);
  return viva.remarks;
};

//for submission
const addRemarkToSubmission = async (courseId, submissionId, remarkData) => {
  const submission = await submissionRepository.getSubmissionById(
    submissionId
  );
  if (!submission) {
    throw new AppError("Submission Not Found", 400);
  }

  if (submission.remarks) {
    throw new AppError("Remark Already Added", 400);
  }

  const remark = await remarkRepository.createRemark(remarkData);

  if (!remark) {
    throw new AppError("Not Saved due To Some Internal Error", 400);
  }

  submission.remarks = remark;
  await submissionRepository.saveSubmission(submission);
  return submission.remarks;
};

const readSubmissionRemark = async (remarkId, submissionId, studentId) => {
  const submission = await submissionRepository.getSubmissionById(
    submissionId
  );
  if (!submission) throw new AppError("Submission Not Found", 400);
  if(submission.student.toString() !== studentId.toString()){
    throw new AppError("Not authorized", 400);
  }
  if (submission.remarks._id.toString() !== remarkId) {
    throw new AppError("Remarks not exists on this submission", 400);
  }

  return submission.remarks;
};

module.exports = {
  addRemarkToViva,
  updateRemark,
  sendRemark,
  addRemarkToSubmission,
  updateRemark,
  readSubmissionRemark,
};

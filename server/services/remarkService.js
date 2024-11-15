const remarkRepository = require("../repositories/remarksRepository");
const AppError = require("../utilities/AppError");
const vivaRepository = require("../repositories/vivaRepository");
const submissionRepository = require("../repositories/submissionRepository");
const authRepository = require("../repositories/authRepository");
const notificationService = require("./notificationService");

const addRemarkToViva = async (classId, projectId, remarkData) => {
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
  for (const student of project.members) {
    const studentData = await authRepository.findStudentById(student);
    const studentAccount = await authRepository.findAccountById(
      studentData.account
    );
    await notificationService.createNotification(
      {
        title: "Remark Updated",
        content: `Your remark has been updated for the viva of ${project.name}`,
        read: false,
      },
      studentAccount._id
    );
  }
  // notify project leader
  const leader = await authRepository.findStudentById(project.projectLeader);
  const leaderAccount = await authRepository.findAccountById(leader.account);
  await notificationService.createNotification(
    {
      title: "Remark Updated",
      content: `Your remark has been updated for the viva of ${project.name}`,
      read: false,
    },
    leaderAccount._id
  );
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
  const submission = await submissionRepository.getSubmissionById(submissionId);
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
  const student = await authRepository.findStudentById(submission.student);
  const studentAccount = await authRepository.findAccountById(student.account);
  await notificationService.createNotification(
    {
      title: "Remark added",
      content: `Your remark has been added for the submission`,
      read: false,
    },
    studentAccount._id
  );
  return submission.remarks;
};

const readSubmissionRemark = async (remarkId, submissionId, userId) => {
  const submission = await submissionRepository.getSubmissionById(submissionId);
  const teacher = await authRepository.findTeacherById(userId);
  if(teacher){
    return submission.remarks;
  }
  if (!submission) throw new AppError("Submission Not Found", 400);
  // console.log(submission.student._id.toString(), userId.toString());
  if (submission.student._id.toString() !== userId.toString()) {
    throw new AppError("Not authorized", 400);
  }
  if (submission.remarks._id.toString() !== remarkId) {
    throw new AppError("Remarks not exists on this submission", 400);
  }
  if(!submission.remarks) {
    throw new AppError("No remark found", 400);
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

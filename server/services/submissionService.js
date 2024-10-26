const submissionRepository = require("../repositories/submissionRepository");
const courseRepository = require("../repositories/courseRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const authRepository = require("../repositories/authRepository");
const notificationService = require("./notificationService");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const path = require("path");

const addSubmission = async (
  courseId,
  assignmentId,
  studentId,
  document_id
) => {
  if (!courseId) {
    throw new Error("Course ID is required");
  }
  if (!assignmentId) {
    throw new Error("Assignment ID is required");
  }
  if (!studentId) {
    throw new Error("Student ID is required");
  }
  if (!document_id) {
    throw new Error("Document ID is required");
  }
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  if (assignment.course.toString() !== courseId) {
    throw new Error("Assignment not found in this course");
  }
  if (assignment.deadline < Date.now()) {
    throw new Error("Assignment deadline has passed");
  }
  const isSubmitted =
    await submissionRepository.getSubmissionByAssignmentAndStudent(
      assignmentId,
      studentId
    );
  if (isSubmitted) {
    throw new Error("Submission already exists update instead");
  }
  const submissionData = {
    assignment: assignmentId,
    student: studentId,
    document_id: document_id,
  };
  const submission = await submissionRepository.createSubmission(
    submissionData
  );
  assignment.submissions.push(submission._id);
  await assignmentRepository.saveAssignment(assignment);
  const teacher = await authRepository.findTeacherById(assignment.teacher);
  const account = await authRepository.findAccountById(teacher.account);
  await notificationService.createNotification(
    {
      title: "New Submission",
      message: `A new submission has been added to ${assignment.title}`,
    },
    account._id
  );
  return submission;
};

const getSubmissionsByAssignment = async (courseId, assignmentId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  if (assignment.course.toString() !== courseId) {
    throw new Error("Assignment not found in this course");
  }
  const submissions = await submissionRepository.getSubmissionsByAssignmentId(
    assignmentId
  );

  return submissions;
};

const getSubmission = async (assignmentId, submissionId, studentId) => {
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  const submission = await submissionRepository.getSubmissionById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }
  if (submission.assignment.toString() !== assignmentId) {
    throw new Error("Submission not found in this assignment");
  }
  console.log(submission.student._id.toString(), studentId.toString());
  if (submission.student.toString() !== studentId.toString()) {
    throw new Error("Not authorized to view this submission");
  }
  return submission;
};

const updateSubmission = async (
  assignmentId,
  submissionId,
  studentId,
  document_id
) => {
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  if (assignment.deadline < Date.now()) {
    throw new Error("Assignment deadline has passed");
  }
  const submission = await submissionRepository.getSubmissionById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }
  if (submission.assignment.toString() !== assignmentId) {
    throw new Error("Submission not found in this assignment");
  }
  if (submission.student.toString() !== studentId.toString()) {
    throw new Error("Not authorized to update this submission");
  }
  if (submission.document_id) {
    deleteFileByPath(
      path.join(__dirname, "../uploads", "submissions", submission.document_id)
    );
  }
  submission.document_id = document_id || submission.document_id;
  submission.submitted_at = Date.now();
  return await submissionRepository.saveSubmission(submission);
};

const deleteSubmission = async (assignmentId, submissionId, studentId) => {
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  const submission = await submissionRepository.getSubmissionById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }
  if (submission.assignment.toString() !== assignmentId) {
    throw new Error("Submission not found in this assignment");
  }
  if (submission.student.toString() !== studentId.toString()) {
    throw new Error("Not authorized to delete this submission");
  }
  if (submission.document_id) {
    deleteFileByPath(
      path.join(__dirname, "../uploads", "submissions", submission.document_id)
    );
  }
  return await submissionRepository.deleteSubmissionById(submissionId);
};

const getSubmissionTeacher = async (submissionId) => {
  const submission = await submissionRepository.getSubmissionById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }
  return submission;
};

module.exports = {
  addSubmission,
  getSubmissionsByAssignment,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionTeacher,
};

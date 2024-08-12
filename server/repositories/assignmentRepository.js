const Assignment = require("../models/Assisgnment");

const createAssignment = async (assignmentData) => {
  const assignment = new Assignment(assignmentData);
  return await assignment.save();
};

const getAssignments = async (courseId) => {
  return await Assignment.find({ course: courseId });
};

const getAssignmentById = async (assignmentId) => {
  return await Assignment.findById(assignmentId);
};

const getAssignmentByTitleAndCourse = async (title, courseId) => {
  return await Assignment.findOne({
    title,
    course: courseId,
  });
};

const deleteAssignmentById = async (assignmentId) => {
  return await Assignment.findByIdAndDelete(assignmentId);
};

const saveAssignment = async (assignment) => {
  return await assignment.save();
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  getAssignmentByTitleAndCourse,
  deleteAssignmentById,
  saveAssignment,
};

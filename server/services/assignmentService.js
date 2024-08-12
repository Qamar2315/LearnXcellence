const assignmentRepository = require("../repositories/assignmentRepository");
const courseRepository = require("../repositories/courseRepository");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const submissionRepository = require("../repositories/submissionRepository");
const path = require("path");

const addAssignment = async (
  courseId,
  teacherId,
  title,
  description,
  document_id
) => {
  if (!title || !description) {
    throw new Error("Title and description are required");
  }
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  const isAssignmentExist =
    await assignmentRepository.getAssignmentByTitleAndCourse(title, courseId);
  if (isAssignmentExist) {
    throw new Error(
      "Assignment with the same title already exists in the same course"
    );
  }
  const assignmentData = {
    course: courseId,
    teacher: teacherId,
    title,
    description,
    document_id,
  };
  const assignment = await assignmentRepository.createAssignment(
    assignmentData
  );
  course.assignments.push(assignment._id);
  await course.save();
  return assignment;
};

const getAssignmentsByCourse = async (courseId) => {
  return await assignmentRepository.getAssignments(courseId);
};

const getAssignment = async (courseId, assignmentId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  if (course.assignments.indexOf(assignmentId) === -1) {
    throw new Error("Assignment not found in the course");
  }
  return assignment;
};

const updateAssignment = async (
  courseId,
  assignmentId,
  title,
  description,
  document_id
) => {
  const assignment = await getAssignment(courseId, assignmentId);
  if (!courseId || !assignmentId) {
    throw new AppError("course id and assignment id must be in params");
  }
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new AppError("course not found");
  }
  if (course.assignments.indexOf(assignmentId) === -1) {
    throw new AppError("assignment not found in the course");
  }
  if (document_id) {
    deleteFileByPath(
      path.join(
        __dirname,
        "../",
        "uploads",
        "assignments",
        assignment.document_id
      )
    );
  }
  assignment.title = title || assignment.title;
  assignment.description = description || assignment.description;
  assignment.document_id = document_id || assignment.document_id;
  assignment.updated_at = Date.now();

  return await assignmentRepository.saveAssignment(assignment);
};

const deleteAssignment = async (courseId, assignmentId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const assignment = await assignmentRepository.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (course.assignments.indexOf(assignmentId) === -1) {
    throw new Error("Assignment not found in the course");
  }
  if (assignment.document_id) {
    try {
      deleteFileByPath(
        path.join(
          __dirname,
          "../",
          "uploads",
          "assignments",
          assignment.document_id
        )
      );
    } catch (err) {
      console.log(err);
    }
  }
  // Delete associated submissions
  await submissionRepository.deleteSubmissionsByAssignmentId(assignmentId);

  // Delete the assignment
  await assignmentRepository.deleteAssignmentById(assignmentId);

  // Remove the assignment reference from the course
  course.assignments = course.assignments.filter(
    (id) => id.toString() !== assignmentId.toString()
  );
  await course.save();
};

module.exports = {
  addAssignment,
  getAssignmentsByCourse,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};

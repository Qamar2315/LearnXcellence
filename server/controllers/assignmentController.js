const assignmentService = require("../services/assignmentService");
const asyncHandler = require("../utilities/CatchAsync");
const path = require("path");

const createAssignment = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { courseId } = req.params;
  const teacherId = req.user._id;
  let document_id;
  if (req.file) {
    document_id = req.file.filename;
  }
  const assignment = await assignmentService.addAssignment(
    courseId,
    teacherId,
    title,
    description,
    document_id
  );
  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    data: assignment,
  });
});

const getAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const assignments = await assignmentService.getAssignmentsByCourse(courseId);
  res.status(200).json(assignments);
});

const getAssignment = asyncHandler(async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const assignment = await assignmentService.getAssignment(
    courseId,
    assignmentId
  );
  res.status(200).json(assignment);
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const { title, description } = req.body;
  const document_id = req.file ? req.file.filename : null;

  const updatedAssignment = await assignmentService.updateAssignment(
    courseId,
    assignmentId,
    title,
    description,
    document_id
  );
  res.status(200).json({
    success: true,
    message: "Assignment updated successfully",
    data: updatedAssignment,
  });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { courseId, assignmentId } = req.params;
  await assignmentService.deleteAssignment(courseId, assignmentId);
  res.status(201).json({ message: "Assignment deleted successfully" });
});

const downloadAssignment = asyncHandler(async (req, res) => {
  const { courseId, assignmentId } = req.params;

  // Get the assignment details
  const assignment = await assignmentService.getAssignment(courseId, assignmentId);

  if (!assignment.document_id) {
    return res.status(404).json({ error: "Assignment document not found" });
  }

  // Construct the file path
  const filePath = path.join(__dirname, "..", "uploads", "assignments", assignment.document_id);

  // Send the file as a response
  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to download the file" });
    }
  });
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAssignment,
};

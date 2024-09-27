const asyncHandler = require("../utilities/CatchAsync");
const projectService = require("../services/projectService");

const createProject = asyncHandler(async (req, res) => {
  const projectData = req.body;
  const userId = req.user._id;
  const project = await projectService.createProject(userId, projectData);
  res.status(201).json({
    success: true,
    message: "Project Created Successfully",
    data: project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const courseId = req.params.courseId;
  const projectData = req.body;
  const updatedProject = await projectService.updateProject(
    courseId,
    projectId,
    projectData
  );
  res.status(201).json({
    success: true,
    message: "Updated Successfully",
    data: updatedProject,
  });
});

const sendProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const project = await projectService.getProjectById(projectId);
  res.status(201).json({
    success: true,
    message: "Project Found",
    data: project,
  });
});

const addMember = asyncHandler(async (req, res) => {
  const { projectId, courseId } = req.params;
  const { email } = req.body;
  const project = await projectService.addMemberToProject(
    projectId,
    email,
    courseId
  );
  res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: project,
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const project = await projectService.removeMemberFromProject(
    projectId,
    memberId
  );
  res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: project,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user._id; // Assume the user's ID is available in the request
  await projectService.deleteProject(projectId, userId);
  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

const generateProjectSuggestions = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const suggestions = await projectService.generateProjectSuggestions(
    courseId
  );
  res.status(200).json({
    success: true,
    message: "Project Suggestions Generated",
    data: suggestions,
  });
});

module.exports = {
  createProject,
  updateProject,
  sendProject,
  addMember,
  removeMember,
  deleteProject,
  generateProjectSuggestions,
};

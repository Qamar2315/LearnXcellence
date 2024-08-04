const asyncHandler = require("../utilities/CatchAsync");
const projectService = require("../services/projectService");

const createProject = asyncHandler(async (req, res) => {
    const projectData = req.body;
    const userId = req.user._id;
    const project = await projectService.createProject(userId, projectData);
    res.status(201).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const projectData = req.body;
    await projectService.updateProject(projectId, projectData);
    res.status(201).json({
        message: "Updated Successfully"
    });
});

const sendProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const project = await projectService.getProjectById(projectId);
    res.status(201).json(project);
});

module.exports = {
    createProject,
    updateProject,
    sendProject
};

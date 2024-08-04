const asyncHandler = require("../utilities/CatchAsync");
const statusService = require("../services/statusService");

const addStatus = asyncHandler(async (req, res) => {
    const { courseId, projectId } = req.params;
    const statusData = req.body;
    const status = await statusService.addStatus(courseId, projectId, statusData);
    res.status(201).json(status);
});

const updateStatus = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    const statusData = req.body;
    await statusService.updateStatus(statusId, statusData);
    res.status(201).json({
        message: "Updated Successfully"
    });
});

const sendStatus = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    const status = await statusService.getStatusById(statusId);
    res.status(201).json(status);
});

module.exports = {
    addStatus,
    updateStatus,
    sendStatus
};

const asyncHandler = require('../utilities/CatchAsync');
const remarkService = require('../services/remarkService');

const addRemark = asyncHandler(async (req, res) => {
    const { courseId, projectId } = req.params;
    const remark = await remarkService.addRemark(courseId, projectId, req.body);
    res.status(201).json(remark);
});

const updateRemark = asyncHandler(async (req, res) => {
    const { remarkId } = req.params;
    await remarkService.updateRemark(remarkId, req.body);
    res.status(201).json({ message: "updated successfully" });
});

const sendRemark = asyncHandler(async (req, res) => {
    const { remarkId } = req.params;
    const remark = await remarkService.sendRemark(remarkId);
    res.status(201).json(remark);
});

module.exports = {
    addRemark,
    updateRemark,
    sendRemark
};

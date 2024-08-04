const asyncHandler = require('../utilities/CatchAsync');
const vivaService = require('../services/vivaService');

const addViva = asyncHandler(async (req, res) => {
    const { courseId, projectId } = req.params;
    const viva = await vivaService.addViva(courseId, projectId);
    res.status(201).json(viva);
});

const updateViva = asyncHandler(async (req, res) => {
    const { vivaId } = req.params;
    const updatedViva = await vivaService.updateViva(vivaId, req.body);
    res.status(201).json({ message: "updated successfully" });
});

const sendViva = asyncHandler(async (req, res) => {
    const { vivaId } = req.params;
    const viva = await vivaService.sendViva(vivaId);
    res.status(201).json(viva);
});

const getTodaysViva = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const vivas = await vivaService.getTodaysViva(classId);
    res.status(201).json({ vivas });
});

module.exports = {
    addViva,
    updateViva,
    sendViva,
    getTodaysViva
};

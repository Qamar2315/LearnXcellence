const remarkRepository = require('../repositories/remarksRepository');
const AppError = require('../utilities/AppError');

const addRemark = async (classId, projectId, remarkData) => {
    const project = await remarkRepository.findProjectByIdAndCourseId(projectId, classId);
    if (!project) throw new AppError("Project Not Found", 400);
    if (project.viva) {
        if (project.viva.status != "taken") throw new AppError("Can't Add Remark Without Taking Viva", 400);
    } else {
        throw new AppError("Didn't Schedule Viva Yet", 400);
    }
    const remark = await remarkRepository.createRemark(remarkData);
    if (!remark) throw new AppError("Not Saved due To Some Internal Error", 400);
    project.remarks = remark;
    await remarkRepository.saveProject(project);
    return {
        _id: remark._id,
        overallPerformance: remark.overallPerformance,
        strengths: remark.strengths,
        inputs: remark.inputs,
        recommendations: remark.recommendations
    };
};

const updateRemark = async (remarkId, updateData) => {
    const checkRemark = await remarkRepository.findRemarkById(remarkId);
    if (!checkRemark) throw new AppError("Remark Not Found", 400);
    await remarkRepository.updateRemark(remarkId, updateData);
};

const sendRemark = async (remarkId) => {
    const remark = await remarkRepository.findRemarkById(remarkId);
    if (!remark) throw new AppError("Remark Not Found", 400);
    return {
        _id: remark._id,
        overallPerformance: remark.overallPerformance,
        strengths: remark.strengths,
        inputs: remark.inputs,
        recommendations: remark.recommendations
    };
};

module.exports = {
    addRemark,
    updateRemark,
    sendRemark
};

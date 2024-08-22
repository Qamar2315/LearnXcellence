const Project = require('../models/Project');
const Remark = require('../models/Remarks');
const Viva = require('../models/Viva');

const findProjectByIdAndCourseId = (projectId, courseId) => Project.findOne({ _id: projectId, course: courseId }).populate('viva');
const createRemark = (remarkData) => Remark.create(remarkData);
const saveProject = (project) => project.save();
const findRemarkById = (remarkId) => Remark.findById(remarkId);
const updateRemark = (remarkId, updateData) => Remark.findByIdAndUpdate(remarkId, updateData, { new: true });
const saveViva = (viva) => viva.save();

module.exports = {
    findProjectByIdAndCourseId ,
    createRemark,
    saveProject,
    findRemarkById,
    updateRemark,
    saveViva
};

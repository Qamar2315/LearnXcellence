const Project = require('../models/Project');
const Viva = require('../models/Viva');
const Course = require('../models/Course');

const findProjectById = (projectId) => Project.findById(projectId).populate('status');
const findVivaByProjectId = (projectId) => Viva.findOne({ project: projectId });
const findCourseById = (courseId) => Course.findById(courseId).populate('vivas');
const createViva = (vivaData) => Viva.create(vivaData);
const saveProject = (project) => project.save();
const saveCourse = (getCourse) => getCourse.save();
const findVivaById = (vivaId) => Viva.findById(vivaId);
const updateViva = (vivaId, updateData) => Viva.findByIdAndUpdate(vivaId, updateData);

module.exports = {
    findProjectById,
    findVivaByProjectId,
    findCourseById,
    createViva,
    saveProject,
    saveCourse,
    findVivaById,
    updateViva
};

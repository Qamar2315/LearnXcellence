const Student = require("../models/Student");
const Course = require("../models/Course");
const Project = require("../models/Project");
const Status = require("../models/Status");

const findStudentById = (id) => Student.findById(id);
const findCourseById = (id) => Course.findById(id);
const findProjectByName = (name) => Project.findOne({ name });
const findProjectByLeaderAndCourse = (student, courseInstance) => Project.findOne({
    projectLeader: student,
    course: courseInstance
});
const createProject = (projectData) => Project.create(projectData);
const createStatus = (statusData) => Status.create(statusData);
const findProjectById = (id) => Project.findById(id).populate("members").populate("projectLeader");
const updateProjectById = (id, updateData) => Project.findByIdAndUpdate(id, updateData, { new: true });
const findProjectByIdAndCourse = (projectId, courseId) => Project.findOne({
    _id: projectId,
    course: courseId
});

const findProjectByNameAndCourse = (name, courseId) => Project.findOne({
    name,
    course: courseId
});

const findProjectByMemberAndCourse = (member, courseInstance) => Project.findOne({
    members: member._id,
    course: courseInstance
});
const deleteProjectById = (id) => Project.findByIdAndDelete(id);

module.exports = {
    findStudentById,
    findCourseById,
    findProjectByName,
    findProjectByLeaderAndCourse,
    createProject,
    createStatus,
    findProjectById,
    updateProjectById,
    findProjectByIdAndCourse,
    findProjectByNameAndCourse,
    findProjectByMemberAndCourse,
    deleteProjectById
};

const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Project = require('../models/Project')
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const Course = require('../models/Course');

const isTeacher = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.user._id);
    if (!teacher) {
        throw new AppError("Not Authorized", 401);
    }
    next();
});
const isStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.user._id);
    if (!student) {
        throw new AppError("Not Authorized", 401);
    }
    next();
});

const isCourseCreator = asyncHandler(async (req, res, next) => {
    const courseId = req.params.courseId;
    const getCourse = await Course.findById(courseId);
    if (!getCourse) {
        throw new AppError("Course Not Found", 401);
    }
    const teacher = await Teacher.findById(req.user._id);
    if (getCourse.teacher._id != teacher.id) {
        throw new AppError("Not Authorized only course creator can perform this action", 401);
    }
    next();
});

const isCourseStudent = asyncHandler(async (req, res, next) => {
    var isStudent=false;
    const  courseId  = req.body.courseId || req.params.courseId;

    for (const course_ of req.user.courses) {
        if (course_ == courseId) {
            isStudent=true;
        }
    }
    if(isStudent){
        next();
    }else{
        throw new AppError("Not Authorized Not Student Of This Course", 401);
    }
});

const isProjectCreator = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const project= await Project.findById(projectId);
    if(!project){
        throw new AppError("Project Not Found", 401);
    }else{
        if(project.projectLeader._id != req.user.id){
            throw new AppError("Not Authorized Only Project Leader Of This Project Can Change", 401);
        }
    }
    next();
});

const isProjectGroupMember = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const project= await Project.findById(projectId);
    var isMember=false;
    if(!project){
        throw new AppError("Project Not Found", 401);
    }else{
        for(let member of project.members){
            if(member == req.user.id){
                isMember=true;
                break;
            }
        }
    }
    if(isMember){
        next();
    }else{
        throw new AppError("Not Authorized Only Group Members Of Project Can View The Status", 401);
    }
});

const isCourseCreatorOrCourseStudent = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;

    // Find the course by ID
    const course = await Course.findById(courseId).populate('teacher');
    if (!course) {
        throw new AppError("Course Not Found", 404);
    }

    const userId = req.user._id;

    // Check if the user is the course creator (teacher)
    if (course.teacher._id.toString() === userId.toString()) {
        return next();
    }

    // Check if the user is a student in the course
    const isStudent = course.students.some(studentId => studentId.toString() === userId.toString());

    if (isStudent) {
        return next();
    }

    // If neither, throw an authorization error
    throw new AppError("Not Authorized: You must be either the course creator or a student of this course", 401);
});


module.exports = {
    isTeacher,
    isStudent,
    isCourseCreator,
    isCourseStudent,
    isProjectCreator,
    isProjectGroupMember,
    isCourseCreatorOrCourseStudent
}
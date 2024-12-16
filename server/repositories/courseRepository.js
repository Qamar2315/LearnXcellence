const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Viva = require("../models/Viva");
const Project = require("../models/Project");

const findTeacherById = (id) => Teacher.findById(id);
const findStudentById = (id) => Student.findById(id);
const findCourseByName = (name) => Course.findOne({ courseName: name });
const findAllCourses = () => Course.find({});
const createCourse = (courseData) => Course.create(courseData);
const findCourseBycourseCode = (courseCode) => Course.findOne({ courseCode });
const findCourseById = (id) => Course.findById(id);
const updateCourseName = (courseId, courseName) =>
  Course.findByIdAndUpdate(courseId, { courseName: courseName });
const deleteVivaById = (id) => Viva.findByIdAndDelete(id);
const deleteProjectById = (id) => Project.findByIdAndDelete(id);
const removeCourseFromTeacher = (teacherId, courseId) =>
  Teacher.findByIdAndUpdate(teacherId, { $pull: { courses: courseId } });
const deleteCourseById = (id) => Course.findByIdAndDelete(id);
const removeStudentFromCourse = (courseId, studentId) =>
  Course.findByIdAndUpdate(courseId, { $pull: { students: studentId } });
const removeCourseFromStudent = (studentId, courseId) =>
  Student.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
const getStudentFromCourse = (courseId, studentId) =>
  Student.findOne({ _id: studentId, courses: courseId });
const getCourseById = (courseId) => Course.findById(courseId);
const getCourseByIdAlongWithTeacher = (courseId) => Course.findById(courseId).populate('teacher');

const isTeacherInCourse = async (courseId, teacherId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    return false; // Course not found
  }
  return course.teacher.toString() === teacherId.toString();
};

module.exports = {
  findTeacherById,
  findStudentById,
  findCourseByName,
  findAllCourses,
  createCourse,
  findCourseBycourseCode,
  findCourseById,
  updateCourseName,
  deleteVivaById,
  deleteProjectById,
  removeCourseFromTeacher,
  deleteCourseById,
  removeStudentFromCourse,
  removeCourseFromStudent,
  getStudentFromCourse,
  getCourseById,
  isTeacherInCourse,
  getCourseByIdAlongWithTeacher
};

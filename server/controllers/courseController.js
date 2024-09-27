const asyncHandler = require("../utilities/CatchAsync");
const courseService = require("../services/courseService");

const createCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  const result = await courseService.createCourse(req.user._id, data);
  res.status(201).json({
    success: true,
    message: "Course Created",
    data: result,
  });
});

const joinCourse = asyncHandler(async (req, res) => {
  const result = await courseService.joinCourse(req.user._id, req.query.courseCode);
  res.status(201).json({
    success: true,
    message: "Course Joined",
    data: result,
  });
});

const updateCourseName = asyncHandler(async (req, res) => {
  await courseService.updateCourseName(req.params.courseId, req.query.courseName);
  res.status(201).json({
    success: true,
    message: "Course Name Updated",
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.courseId, req.user._id);
  res.status(201).json({
    success: true,
    message: "Course Deleted",
  });
});

const leaveCourse = asyncHandler(async (req, res) => {
  await courseService.leaveCourse(req.params.courseId, req.user._id);
  res.status(201).json({
    success: true,
    message: "Course Left",
  });
});

const updateProjectSchedule = asyncHandler(async (req, res) => {
  const result = await courseService.updateProjectSchedule(req.params.courseId, req.body.startDate, req.body.endDate);
  res.status(201).json({
    success: true,
    message: "Project Schedule Updated",
    data: result,
  });
});

const updateVivaSchedule = asyncHandler(async (req, res) => {
  const result = await courseService.updateVivaSchedule(req.params.courseId, req.body.startDate, req.body.endDate);
  res.status(201).json({
    success: true,
    message: "Viva Schedule Updated",
    data: result,
  });
});

const sendAllCourses = asyncHandler(async (req, res) => {
  const result = await courseService.sendAllCourses(req.user.id);
  res.status(201).json({
    success: true,
    data: result,
  });
});

const sendCourse = asyncHandler(async (req, res) => {
  const result = await courseService.sendCourse(req.params.courseId);
  res.status(201).json({
    success: true,
    data: result,
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  const result = await courseService.updateCourse(req.params.courseId, req.body);
  res.status(201).json({
    success: true,
    message: "Course Updated",
    data: result,
  });
});

const regenerateCourseCode = asyncHandler(async (req, res) => {
  const result = await courseService.regenerateCourseCode(req.params.courseId);
  res.status(201).json({
    success: true,
    message: "Course Code Regenerated",
    data: result,
  });
});

const addStudentToCourse = asyncHandler(async (req, res) => {
  const studentId = req.body.studentId;
  const courseId = req.params.courseId;
  const result = await courseService.addStudentToCourse(courseId, studentId);
  res.status(201).json({
    success: true,
    message: "Student Added to Course",
    data: result,
  });
});

const removeStudentFromCourse = asyncHandler(async (req, res) => {
  const studentId = req.body.studentId;
  const courseId = req.params.courseId;
  await courseService.removeStudentFromCourse(courseId, studentId);
  res.status(201).json({
    success: true,
    message: "Student Removed from Course",
  });
});

const searchStudent = asyncHandler(async (req, res) => {
  const studentEmail = req.query.search;
  const result = await courseService.searchStudent(studentEmail);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const searchStudentByEmailEnchanced = asyncHandler(async (req, res) => {
  const studentEmail = req.query.search;
  const result = await courseService.searchStudentByEmailEnchanced(studentEmail);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  createCourse,
  joinCourse,
  deleteCourse,
  updateCourseName,
  updateProjectSchedule,
  updateVivaSchedule,
  leaveCourse,
  sendAllCourses,
  sendCourse,
  updateCourse,
  regenerateCourseCode,
  addStudentToCourse,
  removeStudentFromCourse,
  searchStudent,
  searchStudentByEmailEnchanced,
};

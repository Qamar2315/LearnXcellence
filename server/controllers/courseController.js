const asyncHandler = require("../utilities/CatchAsync");
const courseService = require("../services/courseService");

const createCourse = asyncHandler(async (req, res) => {
  const result = await courseService.createCourse(req.user._id, req.body.courseName);
  res.status(201).json(result);
});

const joinCourse = asyncHandler(async (req, res) => {
  const result = await courseService.joinCourse(req.user._id, req.query.courseCode);
  res.status(201).json(result);
});

const updateCourseName = asyncHandler(async (req, res) => {
  await courseService.updateCourseName(req.params.courseId, req.query.courseName);
  res.status(201).json({ message: "Name Updated Successfully" });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.courseId, req.user._id);
  res.status(201).json({ message: "Deleted Successfully" });
});

const leaveCourse = asyncHandler(async (req, res) => {
  await courseService.leaveCourse(req.params.courseId, req.user._id);
  res.status(201).json({ message: "Course Left" });
});

const updateProjectSchedule = asyncHandler(async (req, res) => {
  const result = await courseService.updateProjectSchedule(req.params.courseId, req.body.startDate, req.body.endDate);
  res.status(201).json(result);
});

const updateVivaSchedule = asyncHandler(async (req, res) => {
  const result = await courseService.updateVivaSchedule(req.params.courseId, req.body.startDate, req.body.endDate);
  res.status(201).json(result);
});

const sendAllCourses = asyncHandler(async (req, res) => {
  const result = await courseService.sendAllCourses(req.user.id);
  res.status(201).json(result);
});

const sendCourse = asyncHandler(async (req, res) => {
  const result = await courseService.sendCourse(req.params.courseId);
  res.status(201).json(result);
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
};

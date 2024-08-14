const Lecture = require("../models/Lecture");

const createLecture = async (lectureData) => {
  const lecture = new Lecture(lectureData);
  return await lecture.save();
};

const getLectures = async (courseId) => {
  return await Lecture.find({ course: courseId });
};

const getLectureById = async (lectureId) => {
  return await Lecture.findById(lectureId);
};

const getLectureByTitleAndCourse = async (title, courseId) => {
  return await Lecture.findOne({
    title,
    course: courseId,
  });
};

const deleteLectureById = async (lectureId) => {
  return await Lecture.findByIdAndDelete(lectureId);
};

const saveLecture = async (lecture) => {
  return await lecture.save();
};

module.exports = {
  createLecture,
  getLectures,
  getLectureById,
  getLectureByTitleAndCourse,
  deleteLectureById,
  saveLecture,
};

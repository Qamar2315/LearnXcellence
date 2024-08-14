const lectureRepository = require("../repositories/lectureRepository");
const courseRepository = require("../repositories/courseRepository");
const { deleteFileByPath } = require("../utilities/deleteFilesByPath");
const path = require("path");

const addLecture = async (courseId, teacherId, title, description, video_id) => {
  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const isLectureExist = await lectureRepository.getLectureByTitleAndCourse(
    title,
    courseId
  );
  if (isLectureExist) {
    throw new Error(
      "Lecture with the same title already exists in the same course"
    );
  }

  const lectureData = {
    course: courseId,
    teacher: teacherId,
    title,
    description,
    video_id,
  };
  const lecture = await lectureRepository.createLecture(lectureData);
  course.lectures.push(lecture._id);
  await course.save();
  return lecture;
};

const getLecturesByCourse = async (courseId) => {
  const course = await courseRepository.getCourseById(courseId);
  await course.populate('lectures');
  return course.lectures;
};

const getLecture = async (courseId, lectureId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  const lecture = await lectureRepository.getLectureById(lectureId);
  if (!lecture) {
    throw new Error("Lecture not found");
  }
  if (course.lectures.indexOf(lectureId) === -1) {
    throw new Error("Lecture not found in the course");
  }
  return lecture;
};

const updateLecture = async (
  courseId,
  lectureId,
  title,
  description,
  video_id,
  
) => {
  const lecture = await getLecture(courseId, lectureId);
  if (!courseId || !lectureId) {
    throw new Error("Course id and lecture id must be in params");
  }
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  if (course.lectures.indexOf(lectureId) === -1) {
    throw new Error("Lecture not found in the course");
  }
  if (video_id) {
    deleteFileByPath(
      path.join(__dirname, "..", "uploads", "lectures", lecture.video_id)
    );
  }

  lecture.title = title || lecture.title;
  lecture.description = description || lecture.description;
  lecture.video_id = video_id || lecture.video_id;
  lecture.updated_at = Date.now();

  return await lectureRepository.saveLecture(lecture);
};

const deleteLecture = async (courseId, lectureId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const lecture = await lectureRepository.getLectureById(lectureId);
  if (!lecture) {
    throw new Error("Lecture not found");
  }

  if (course.lectures.indexOf(lectureId) === -1) {
    throw new Error("Lecture not found in the course");
  }

  if (lecture.video_id) {
    try {
      deleteFileByPath(
        path.join(__dirname, "..", "uploads", "lectures", lecture.video_id)
      );
    } catch (err) {
      console.log(err);
    }
  }

  await lectureRepository.deleteLectureById(lectureId);

  course.lectures = course.lectures.filter(
    (id) => id.toString() !== lectureId.toString()
  );
  await course.save();
};

module.exports = {
  addLecture,
  getLecturesByCourse,
  getLecture,
  updateLecture,
  deleteLecture,
};

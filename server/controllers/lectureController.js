const lectureService = require("../services/lectureService");
const asyncHandler = require("../utilities/CatchAsync");
const path = require("path");

const createLecture = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { courseId } = req.params;
  const teacherId = req.user._id;
  let video_id;
  if (req.file) {
    video_id = req.file.filename;
  }

  if(!video_id) {
    return res.status(400).json({ error: "Please upload a video file" });
  }
  
  const lecture = await lectureService.addLecture(
    courseId,
    teacherId,
    title,
    description,
    video_id
  );
  res.status(201).json({
    success: true,
    message: "Lecture created successfully",
    data: lecture,
  });
});

const getLectures = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const lectures = await lectureService.getLecturesByCourse(courseId);
  res.status(200).json(lectures);
});

const getLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const lecture = await lectureService.getLecture(courseId, lectureId);
  res.status(200).json(lecture);
});

const updateLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const { title, description } = req.body;
  const video_id = req.file ? req.file.filename : null;
  const updatedLecture = await lectureService.updateLecture(
    courseId,
    lectureId,
    title,
    description,
    video_id
  );
  res.status(200).json({
    success: true,
    message: "Lecture updated successfully",
    data: updatedLecture,
  });
});

const deleteLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  await lectureService.deleteLecture(courseId, lectureId);
  res.status(201).json({ message: "Lecture deleted successfully" });
});

const downloadLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;

  const lecture = await lectureService.getLecture(courseId, lectureId);

  if (!lecture.video_id) {
    return res.status(404).json({ error: "Lecture video not found" });
  }

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "lectures",
    lecture.video_id
  );

  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to download the file" });
    }
  });
});

module.exports = {
  createLecture,
  getLectures,
  getLecture,
  updateLecture,
  deleteLecture,
  downloadLecture,
};

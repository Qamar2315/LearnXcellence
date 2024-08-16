const pollService = require("../services/pollService");
const asyncHandler = require("../utilities/CatchAsync");


const createPoll = asyncHandler(async (req, res) => {
  const { title, description, options } = req.body;
  const { courseId } = req.params;
  const teacherId = req.user._id;

  const poll = await pollService.addPoll(courseId, teacherId, title, description, options);
  res.status(201).json({
    success: true,
    message: "Poll created successfully",
    data: poll,
  });
});

const getPolls = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const polls = await pollService.getPollsByCourse(courseId);
  res.status(200).json(polls);
});

const getPoll = asyncHandler(async (req, res) => {
  const { courseId, pollId } = req.params;
  const poll = await pollService.getPoll(courseId, pollId);
  res.status(200).json(poll);
});

const votePoll = asyncHandler(async (req, res) => {
  const { courseId, pollId } = req.params;
  const { option } = req.body;
  const studentId = req.user._id;

  const poll = await pollService.votePoll(courseId, pollId, studentId, option);
  res.status(200).json({
    success: true,
    message: "Voted successfully",
    data: poll,
  });
});

const deletePoll = asyncHandler(async (req, res) => {
  const { courseId, pollId } = req.params;
  await pollService.deletePoll(courseId, pollId);
  res.status(200).json({ message: "Poll deleted successfully" });
});

module.exports = {
  createPoll,
  getPolls,
  getPoll,
  votePoll,
  deletePoll,
};

const Poll = require("../models/Poll");

const createPoll = async (pollData) => {
  const poll = new Poll(pollData);
  return await poll.save();
};

const getPolls = async (courseId) => {
  return await Poll.find({ course: courseId }).populate({
    path: "votes",
    populate: {
      path: "student",
      select: "_id name account",
      populate: {
        path: "account",
        select: "email profile",
      },
    },
  });
};

const getPollById = async (pollId) => {
  return await Poll.findById(pollId).populate("votes");
};

const deletePollById = async (pollId) => {
  return await Poll.findByIdAndDelete(pollId);
};

const savePoll = async (poll) => {
  return await poll.save();
};

module.exports = {
  createPoll,
  getPolls,
  getPollById,
  deletePollById,
  savePoll,
};

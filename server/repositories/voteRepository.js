const Vote = require("../models/Vote");

const createVote = async (voteData) => {
  const vote = new Vote(voteData);
  return await vote.save();
};

const getVoteByPollAndStudent = async (pollId, studentId) => {
  return await Vote.findOne({ poll: pollId, student: studentId });
};

const updateVote = async (voteId, option) => {
  return await Vote.findByIdAndUpdate(
    voteId,
    { option, updated_at: Date.now() },
    { new: true }
  );
};

const deleteVoteById = async (voteId) => {
  return await Vote.findByIdAndDelete(voteId);
};

const getVotesByPollId = async (pollId) => {
  return await Vote.find({ poll: pollId });
};

const saveVote = async (vote) => {
  return await vote.save();
};

module.exports = {
  createVote,
  getVoteByPollAndStudent,
  updateVote,
  deleteVoteById,
  getVotesByPollId,
  saveVote,
};

const pollRepository = require("../repositories/pollRepository");
const courseRepository = require("../repositories/courseRepository");
const voteRepository = require("../repositories/voteRepository");
const AppError = require("../utilities/AppError");

const addPoll = async (courseId, teacherId, title, description, options) => {
  if (!title || !options || options.length < 2 || options.length > 3) {
    throw new Error("Title and valid options (between 2 and 3) are required.");
  }

  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const pollData = {
    course: courseId,
    teacher: teacherId,
    title,
    description,
    options,
  };

  const poll = await pollRepository.createPoll(pollData);
  course.polls.push(poll._id);
  await course.save();

  return poll;
};

const getPollsByCourse = async (courseId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  return await pollRepository.getPolls(courseId);
};

const getPoll = async (courseId, pollId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const poll = await pollRepository.getPollById(pollId);
  if (!poll) {
    throw new Error("Poll not found");
  }

  if (poll.course.toString() !== courseId.toString()) {
    throw new Error("Poll not found in this course");
  }

  return poll;
};

const votePoll = async (courseId, pollId, studentId, option) => {
  if (!option) {
    throw new AppError("Option is required", 400);
  }
  const poll = await pollRepository.getPollById(pollId);

  if (!poll) {
    throw new AppError("Poll not found", 404);
  }

  if (poll.course.toString() !== courseId.toString()) {
    throw new AppError("Poll not found in this course", 404);
  }
  if (poll.options.indexOf(option) === -1) {
    throw new AppError("Invalid option", 400);
  }
  const existingVote = await voteRepository.getVoteByPollAndStudent(
    pollId,
    studentId
  );

  if (existingVote) {
    if (existingVote.option === option) {
      return poll;
    } else {
      // Update the existing vote
      existingVote.option = option;
      await voteRepository.saveVote(existingVote);
      poll.updated_at = Date.now();
      await pollRepository.savePoll(poll);
      // Retrieve the updated poll from the database
      const updatedPoll = await pollRepository.getPollById(poll._id);

      // Return the updated poll
      return updatedPoll;
    }
  } else {
    // Create a new vote
    const newVote = await voteRepository.createVote({
      poll: pollId,
      student: studentId,
      option,
    });
    poll.votes.push(newVote._id);
    poll.updated_at = Date.now();
    await pollRepository.savePoll(poll);
    return poll;
  }
};

const deletePoll = async (courseId, pollId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const poll = await pollRepository.getPollById(pollId);
  if (!poll) {
    throw new Error("Poll not found");
  }

  await pollRepository.deletePollById(pollId);

  course.polls = course.polls.filter(
    (id) => id.toString() !== pollId.toString()
  );
  await course.save();
};

module.exports = {
  addPoll,
  getPollsByCourse,
  getPoll,
  votePoll,
  deletePoll,
};

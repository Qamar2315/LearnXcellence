const quizRepository = require("../repositories/quizRepository");
const questionRepository = require("../repositories/questionRepository");
const courseRepository = require("../repositories/courseRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const proctoringReportRepository = require("../repositories/proctoringReportRepository");
const { calculateQuizScore } = require("../utilities/calculateQuizScore");
const _ = require("lodash");
const AppError = require("../utilities/AppError");

const createQuiz = async (
  courseId,
  title,
  topic,
  questions,
  deadline,
  duration,
  number_of_questions
) => {
  if (
    !courseId ||
    !title ||
    !questions ||
    !topic ||
    !deadline ||
    !duration ||
    !number_of_questions
  ) {
    throw new AppError("Input all required fields", 400);
  }
  if (new Date(deadline) < new Date()) {
    throw new AppError("Deadline must be in the future", 400);
  }
  let course = await courseRepository.getCourseById(courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }
  const questionIds = [];
  for (const questionData of questions) {
    let question = await questionRepository.findQuestionByContent(
      questionData.content
    );
    if (!question) {
      question = await questionRepository.createQuestion(questionData);
    }
    questionIds.push(question._id);
  }

  const quiz = await quizRepository.createQuiz({
    course,
    title,
    deadline,
    topic,
    duration,
    number_of_questions,
    questions: questionIds,
  });
  course.quizzes.push(quiz._id);
  await course.save();

  return quiz;
};

const updateQuiz = async (
  quizId,
  title,
  topic,
  questions,
  deadline,
  duration,
  number_of_questions
) => {
  if (
    !quizId ||
    !title ||
    !questions ||
    !topic ||
    !deadline ||
    !duration ||
    !number_of_questions
  ) {
    throw new AppError("Input all required fields", 400);
  }

  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (new Date(deadline) < new Date()) {
    throw new AppError("Deadline must be in the future", 400);
  }
  const questionIds = [];
  for (const questionData of questions) {
    let question = await questionRepository.findQuestionByContent(
      questionData.content
    );
    if (!question) {
      question = await questionRepository.createQuestion(questionData);
    }
    questionIds.push(question._id);
  }

  quiz.title = title;
  quiz.topic = topic;
  quiz.deadline = deadline;
  quiz.duration = duration;
  quiz.number_of_questions = number_of_questions;
  quiz.questions = questionIds;
  await quiz.save();
  return quiz;
};

const deleteQuiz = async (quizId, courseId) => {
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  if (courseId !== quiz.course.toString()) {
    throw new AppError("Course ID does not match", 400);
  }
  // Delete quiz
  await quizRepository.deleteQuizById(quizId);
  // Remove the quiz reference from the associated course
  const course = await courseRepository.getCourseById(quiz.course);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  course.quizzes.pull(quizId);
  await course.save();
};

const getQuiz = async (id, courseId) => {
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (quiz.course.toString() !== courseId) {
    throw new AppError("Course ID does not match", 400);
  }
  return quiz;
};

const getQuizStudent = async (id, courseId) => {
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (quiz.course.toString() !== courseId) {
    throw new AppError("Course ID does not match", 400);
  }

  // Shuffle the questions
  const shuffledQuestions = _.shuffle(quiz.questions);

  // Get the number of questions stated in the quiz model
  const numberOfQuestions = quiz.number_of_questions;

  // Return the specified number of questions
  const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);

  // If you need to return the entire quiz object with the modified questions
  return { ...quiz.toObject(), questions: selectedQuestions };
};

const getQuizzesByCourse = async (courseId) => {
  const quizzes = await quizRepository.getQuizzesByCourse(courseId);
  return quizzes;
};

const startQuiz = async (quizId, studentId) => {
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const existingSubmission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );
  if (existingSubmission && !existingSubmission.isCompleted) {
    throw new AppError("Quiz is already started and not completed", 400);
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + quiz.duration * 60000);

  const newSubmission = await quizSubmissionRepository.createSubmission({
    quiz: quizId,
    student: studentId,
    startedAt: startTime,
    endTime: endTime,
  });

  quiz.submissions.push(newSubmission._id);
  await quiz.save();

  // Create the proctoring report and link it to the submission
  const proctoringReport =
    await proctoringReportRepository.createProctoringReport({
      submission: newSubmission._id,
    });

  return { newSubmission, proctoringReport };
};

const submitQuiz = async (quizId, studentId, answers) => {
  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );
  if (!answers) {
    throw new AppError("Input answers");
  }
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  if (submission.isCompleted) {
    throw new AppError("Quiz already submitted", 400);
  }

  const currentTime = new Date();
  if (currentTime > submission.endTime) {
    throw new AppError("Quiz time has expired", 400);
  }

  submission.answers = answers;
  submission.submittedAt = currentTime;
  submission.isCompleted = true;
  const isFlagged = false;

  if (isFlagged) {
    submission.isFlagged = true;
    await submission.save();
    return submission;
  }
  submission.score = calculateQuizScore(
    answers,
    quiz.questions
  );
  await submission.save();
  return submission;
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
  getQuizStudent,
  startQuiz,
  submitQuiz,
};

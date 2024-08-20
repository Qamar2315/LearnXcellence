const quizRepository = require("../repositories/quizRepository");
const questionRepository = require("../repositories/questionRepository");
const courseRepository = require("../repositories/courseRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const proctoringReportRepository = require("../repositories/proctoringReportRepository");
const { calculateQuizScore } = require("../utilities/calculateQuizScore");
const _ = require("lodash");
const AppError = require("../utilities/AppError");
const axios = require("axios");

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
      images: [],
      cheating_indicators: {
        mobile_phone: 0,
        extra_person: 0,
        mouth_open: 0,
        no_person: 0,
        eye_left_right: 0,
      },
    });

  newSubmission.proctoringReport = proctoringReport;
  await newSubmission.save();

  return newSubmission;
};

const submitQuiz = async (quizId, studentId, answers) => {
  // Find the submission for the given quiz and student
  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  // Validate if answers are provided
  if (!answers) {
    throw new AppError("Input answers");
  }

  // Fetch the quiz details by ID
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  // Check if the submission exists
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Check if the quiz has already been submitted
  if (submission.isCompleted) {
    throw new AppError("Quiz already submitted", 400);
  }

  // Ensure the submission is within the allowed time
  const currentTime = new Date();
  if (currentTime > submission.endTime) {
    throw new AppError("Quiz time has expired", 400);
  }

  // Update submission with the provided answers
  submission.answers = answers;
  submission.submittedAt = currentTime;
  submission.isCompleted = true;

  // Fetch the proctoring report linked to the submission
  const proctoringReport =
    await proctoringReportRepository.getProctoringReportById(
      submission.proctoringReport
    );

  // Extract features from the proctoring report for cheating detection
  const features = [
    proctoringReport.images.length,
    proctoringReport.cheating_indicators.mobile_phone,
    proctoringReport.cheating_indicators.extra_person,
    proctoringReport.cheating_indicators.mouth_open,
    proctoringReport.cheating_indicators.no_person,
    proctoringReport.cheating_indicators.eye_left_right,
  ];

  // Make a request to the Flask API to assess cheating probability
  let isFlagged = false;
  const response = await axios.post(
    `${process.env.FLASK_URL}/predict-cheating`,
    {
      features: features,
    }
  );

  // Extract cheating probability from the response
  const cheatingProbability = response.data.data.cheating_probability;

  // Flag the submission if cheating probability is above the threshold
  if (cheatingProbability > 60) {
    isFlagged = true;
  }

  if (isFlagged) {
    submission.isFlagged = true;
  }

  // Update the proctoring report with the cheating probability
  proctoringReport.cheating_probability = cheatingProbability;

  // Calculate and assign the quiz score based on the submitted answers
  submission.score = calculateQuizScore(answers, quiz.questions);

  // Save the updated proctoring report and submission
  await proctoringReport.save();
  await submission.save();

  // Return the updated submission
  return submission;
};

const updateSubmissionMarks = async (courseId, quizId, submissionId, newScore) => {
  // Get the course by its ID
  const course = await courseRepository.getCourseById(courseId);
  
  // Check if the course exists
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if the quiz belongs to the course
  const quizBelongsToCourse = course.quizzes.includes(quizId);
  if (!quizBelongsToCourse) {
    throw new AppError("Quiz does not belong to the specified course", 400);
  }

  // Fetch the quiz details by ID
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  // Find the submission for the given quiz and student
  const submission = await quizSubmissionRepository.findSubmissionById(submissionId);
  
  // Check if the submission exists
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Check if the quiz has already been submitted
  if (!submission.isCompleted) {
    throw new AppError("Quiz has not been submitted yet", 400);
  }

  if (newScore < 0) {
    throw new AppError("Score cannot be negative", 400);
  }

  if(newScore > quiz.number_of_questions){
    throw new AppError("Score cannot be greater than the number of questions", 400);
  }
  // Update the submission score
  submission.score = newScore;

  // Save the updated submission
  await submission.save();

  return submission;
};

const updateSubmissionFlag = async (courseId, quizId, submissionId, isFlagged) => {
  // Fetch the course to ensure the quiz belongs to it
  const course = await courseRepository.getCourseById(courseId);

  // Ensure the quiz belongs to the course
  if (!course.quizzes.includes(quizId)) {
      throw new AppError("Quiz does not belong to the specified course", 404);
  }

  // Fetch the submission
  const submission = await quizSubmissionRepository.findSubmissionById(submissionId);
  if (!submission) {
      throw new AppError("Submission not found", 404);
  }

  // Ensure the submission is for the correct quiz
  if (submission.quiz.toString() !== quizId) {
      throw new AppError("Submission does not belong to the specified quiz", 400);
  }

  // Update the isFlagged status
  submission.isFlagged = isFlagged;
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
  updateSubmissionMarks,
  updateSubmissionFlag
};

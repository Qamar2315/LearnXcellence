const quizRepository = require("../repositories/quizRepository");
const questionRepository = require("../repositories/questionRepository");
const courseRepository = require("../repositories/courseRepository");

const AppError = require("../utilities/AppError");

const createQuiz = async (courseId, title, topic, questions, deadline) => {
  if (!courseId || !title || !questions || !topic || !deadline) {
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
    questions: questionIds,
  });
  course.quizzes.push(quiz._id);
  await course.save();

  return quiz;
};

const updateQuiz = async (quizId, title, topic, questions, deadline) => {
  if (!quizId || !title || !questions || !topic || !deadline) {
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
  quiz.questions = questionIds;
  await quiz.save();

  return quiz;
};

const deleteQuiz = async (quizId, courseId) => {
    const quiz = await quizRepository.getQuizById(quizId);
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }

    if(courseId !== quiz.course.toString()) {
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

const getQuizzesByCourse = async (courseId) => {
  const quizzes = await quizRepository.getQuizzesByCourse(courseId);
  return quizzes;
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
};

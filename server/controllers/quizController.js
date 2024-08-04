const asyncHandler = require('../utilities/CatchAsync');
const quizService = require('../services/quizService');

const createQuiz = asyncHandler(async (req, res) => {
    const { title, topic, questions } = req.body;
    const course = req.params.courseId;
    const quiz = await quizService.createQuiz(course, title, topic, questions);
    res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: {
            quiz,
        },
    });
});

const updateQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const quiz = await quizService.updateQuiz(id, updates);
    res.status(200).json(quiz);
});

const deleteQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await quizService.deleteQuiz(id);
    res.status(204).send();
});

const getQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const quiz = await quizService.getQuiz(id);
    res.status(200).json(quiz);
});

const getQuizzesByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await quizService.getQuizzesByCourse(courseId);
    res.status(200).json(quizzes);
});

module.exports = {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    getQuizzesByCourse,
};

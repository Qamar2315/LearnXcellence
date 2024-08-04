const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.route('/create')
    .post(quizController.createQuiz);

router.route('/update/:id')
    .patch(quizController.updateQuiz);

router.route('/delete/:id')
    .delete(quizController.deleteQuiz);

router.route('/:id')
    .get(quizController.getQuiz);

router.route('/course/:courseId')
    .get(quizController.getQuizzesByCourse);

module.exports = router;

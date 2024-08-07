const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const {isLogin} = require('../middlewares/isLogin');
const {isTeacher,isCourseCreator} = require('../middlewares/authorization');
const {isEmailVerified} = require('../middlewares/isEmailVerified');
const { validateQuiz } = require('../middlewares/schemaValidator'); 

router.route('/:courseId/create')
    .post(isLogin,isEmailVerified,isTeacher,isCourseCreator,validateQuiz,quizController.createQuiz);

router.route('/course/:courseId')
    .get(isLogin,isEmailVerified ,quizController.getQuizzesByCourse);

router.route('/:courseId/:id')
    .get(isLogin,isEmailVerified,quizController.getQuiz)
    .patch(isLogin,isEmailVerified,isTeacher,isCourseCreator,validateQuiz,quizController.updateQuiz)
    .delete(isLogin,isEmailVerified,isTeacher,isCourseCreator,quizController.deleteQuiz);

module.exports = router;

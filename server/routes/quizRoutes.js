const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const {isLogin} = require('../middlewares/isLogin');
const {isTeacher,isCourseCreator, isCourseStudent, isStudent} = require('../middlewares/authorization');
const {isEmailVerified} = require('../middlewares/isEmailVerified');
const { validateQuiz } = require('../middlewares/schemaValidator'); 

router.route('/:courseId/create')
    .post(isLogin,isEmailVerified,isTeacher,isCourseCreator,validateQuiz,quizController.createQuiz);

router.route('/course/:courseId')
    .get(isLogin,isEmailVerified ,quizController.getQuizzesByCourse);

router.route('/:courseId/:id/get')
    .get(isLogin,isEmailVerified,isCourseStudent,isCourseStudent,quizController.getQuizStudent)



router.route('/:courseId/:id/start')
    .post(isLogin, isEmailVerified, isStudent,isCourseStudent, quizController.startQuiz);

router.route('/:courseId/:id/submit')
    .post(isLogin, isEmailVerified, isStudent, quizController.submitQuiz);

// router.route('/submissions/:submissionId/time')
//     .get(isLogin, isEmailVerified, isStudent, quizController.getRemainingTime);



router.route('/:courseId/:id')
    .get(isLogin,isEmailVerified,isTeacher,isCourseCreator,quizController.getQuiz)
    .patch(isLogin,isEmailVerified,isTeacher,isCourseCreator,validateQuiz,quizController.updateQuiz)
    .delete(isLogin,isEmailVerified,isTeacher,isCourseCreator,quizController.deleteQuiz);



module.exports = router;

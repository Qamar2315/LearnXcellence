// ./routes/index.js

const express = require('express');
const router = express.Router();

const courseRoutes = require('./courseRoutes');
const projectRoutes = require('./projectRoutes');
const remarkRoutes = require('./remarkRoutes');
const statusRoutes = require('./statusRoutes');
const vivaRoutes = require('./vivaRoutes');
const announcementRoutes = require('./announcementRoutes');
const authRoutes = require('./authRoutes');
const proctoringRoutes = require('./proctoringRoutes');
const quizRoutes = require('./quizRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const submissionRoutes = require('./submissionRoutes');
const lectureRoutes = require('./lectureRoutes');
const pollRoutes = require('./pollRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/project', projectRoutes);
router.use('/remarks', remarkRoutes);
router.use('/status', statusRoutes);
router.use('/viva', vivaRoutes);
router.use('/announcements', announcementRoutes);
router.use('/ai-proctoring', proctoringRoutes);
router.use('/quiz', quizRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/lectures', lectureRoutes);
router.use('/polls', pollRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router; 
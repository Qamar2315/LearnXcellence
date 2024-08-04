const Course = require("../models/Course");
const Announcement = require("../models/Announcement");

const findCourseById = (courseId) => Course.findById(courseId);
const findCourseByIdWithCourseAnnouncements = (courseId) => Course.findById(courseId).populate('announcements');
const createAnnouncement = (announcementData) => Announcement.create(announcementData);
const deleteAnnouncementById = (announcementId) => Announcement.findByIdAndDelete(announcementId);

module.exports = {
    findCourseById,
    findCourseByIdWithCourseAnnouncements,
    createAnnouncement,
    deleteAnnouncementById
};

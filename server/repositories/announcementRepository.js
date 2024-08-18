const Course = require("../models/Course");
const Announcement = require("../models/Announcement");

const findCourseById = (courseId) => Course.findById(courseId);
const findCourseByIdWithAnnouncements = (courseId) => Course.findById(courseId).populate('announcements');
const createAnnouncement = (announcementData) => Announcement.create(announcementData);
const deleteAnnouncementById = (announcementId) => Announcement.findByIdAndDelete(announcementId);
const updateAnnouncementById = (announcementId, updateData) => Announcement.findByIdAndUpdate(announcementId, updateData, { new: true });
const findAnnouncementById = (announcementId) => Announcement.findById(announcementId);

module.exports = {
    findCourseById,
    findCourseByIdWithAnnouncements,
    createAnnouncement,
    deleteAnnouncementById,
    updateAnnouncementById,
    findAnnouncementById
};

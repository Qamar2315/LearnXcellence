const announcementRepository = require("../repositories/announcementRepository");
const AppError = require("../utilities/AppError");

const sendCourseAnnouncement = async (courseId, announcementData) => {
    const getCourse = await announcementRepository.findCourseById(courseId);
    if (!getCourse) {
        throw new AppError("Course Not Found", 400);
    }
    const announcement = await announcementRepository.createAnnouncement(announcementData);
    getCourse.announcements.push(announcement);
    await getCourse.save();
    return {
        _id: announcement._id,
        message: announcement.content
    };
};

const deleteAnnouncement = async (announcementId) => {
    await announcementRepository.deleteAnnouncementById(announcementId);
};

const getAllCourseAnnouncements = async (courseId) => {
    const getCourse = await announcementRepository.findCourseByIdWithCourseAnnouncements(courseId);
    if (!getCourse) {
        throw new AppError("Course Not Found", 400);
    }
    return getCourse.announcements;
};

module.exports = {
    sendCourseAnnouncement,
    deleteAnnouncement,
    getAllCourseAnnouncements
};

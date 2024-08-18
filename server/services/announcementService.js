const announcementRepository = require("../repositories/announcementRepository");
const AppError = require("../utilities/AppError");

const sendCourseAnnouncement = async (courseId, announcementData, teacherId) => {
    const course = await announcementRepository.findCourseById(courseId);
    if (!course) {
        throw new AppError("Course not found", 400);
    }
    const announcement = await announcementRepository.createAnnouncement({
        ...announcementData,
        course: courseId,
        teacher: teacherId
    });
    course.announcements.push(announcement._id);
    await course.save();
    // TODO: Notify students of the new announcement
    return {
        _id: announcement._id,
        title: announcement.title,
        message: announcement.content
    };
};

const deleteAnnouncement = async (announcementId) => {
    const announcement = await announcementRepository.findAnnouncementById(announcementId);
    if (!announcement) {
        throw new AppError("Announcement not found", 404);
    }
    await announcementRepository.deleteAnnouncementById(announcementId);
};

const updateAnnouncement = async (announcementId, updateData) => {
    const announcement = await announcementRepository.findAnnouncementById(announcementId);

    if (!announcement) {
        throw new AppError("Announcement not found", 404);
    }
    await announcementRepository.updateAnnouncementById(announcementId, updateData);

    return announcement;
};

const getAllCourseAnnouncements = async (courseId) => {
    const course = await announcementRepository.findCourseByIdWithAnnouncements(courseId);
    if (!course) {
        throw new AppError("Course not found", 400);
    }
    return course.announcements;
};

module.exports = {
    sendCourseAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    getAllCourseAnnouncements
};

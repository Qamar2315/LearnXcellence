const asyncHandler = require("../utilities/CatchAsync");
const announcementService = require("../services/announcementService");

const sendCourseAnnouncement = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const announcement = await announcementService.sendCourseAnnouncement(courseId, req.body);
    res.status(201).json(announcement);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;
    await announcementService.deleteAnnouncement(announcementId);
    res.status(201).json({
        message: "Announcement Deleted Successfully"
    });
});

const getAllCourseAnnouncements = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const courseAnnouncements = await announcementService.getAllCourseAnnouncements(courseId);
    res.status(201).json({ courseAnnouncements });
});

module.exports = {
    sendCourseAnnouncement,
    deleteAnnouncement,
    getAllCourseAnnouncements
};

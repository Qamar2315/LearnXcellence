const asyncHandler = require("../utilities/CatchAsync");
const announcementService = require("../services/announcementService");

const sendCourseAnnouncement = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const announcement = await announcementService.sendCourseAnnouncement(courseId, req.body, req.user._id);
    res.status(201).json({
        success: true,
        message: "Announcement sent successfully",
        data: announcement
    });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;
    const teacherId = req.user._id;
    await announcementService.deleteAnnouncement(announcementId, teacherId);
    res.status(200).json({
        success: true,
        message: "Announcement deleted successfully"
    });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;
    const teacherId = req.user._id;
    const updatedAnnouncement = await announcementService.updateAnnouncement(announcementId, req.body, teacherId);
    res.status(200).json({
        success: true,
        message: "Announcement updated successfully",
        data: updatedAnnouncement
    });
});

const getAllCourseAnnouncements = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const courseAnnouncements = await announcementService.getAllCourseAnnouncements(courseId);
    res.status(200).json({
        success: true,
        message: "Announcements fetched successfully",
        data: courseAnnouncements
    });
});

module.exports = {
    sendCourseAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    getAllCourseAnnouncements
};

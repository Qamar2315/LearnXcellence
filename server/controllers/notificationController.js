const notificationService = require("../services/notificationService");
const asyncHandler = require("../utilities/CatchAsync");
const AppError = require("../utilities/AppError");


// Mark a notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
    const user = req.user;

  await notificationService.markNotificationAsRead(notificationId,user);

  res.status(200).json({
    success: true,
    message: "Notification marked as read successfully",
  });
});

// Get all notifications for a user
const getAllNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const notifications = await notificationService.getAllNotifications(user);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

module.exports = {
  markNotificationAsRead,
  getAllNotifications,
};
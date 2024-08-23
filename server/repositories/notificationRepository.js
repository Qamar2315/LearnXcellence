const Notification = require("../models/Notification");

const createNotification = (notificationData) =>
  Notification.create(notificationData);

const findNotificationById = (notificationId) =>
  Notification.findById(notificationId);

module.exports = {
  createNotification,
  findNotificationById,
};
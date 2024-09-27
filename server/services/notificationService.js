const notificationRepository = require("../repositories/notificationRepository");
const authRepository = require("../repositories/authRepository");
const AppError = require("../utilities/AppError");

// Mark a notification as read
const markNotificationAsRead = async (notificationId, user) => {
  const userAccount = await authRepository.findAccountById(user.account);
  if (!userAccount) {
    throw new AppError("Account not found", 404);
  }

  const notification = await notificationRepository.findNotificationById(
    notificationId
  );
  if (!notification) {
    throw new AppError("Notification not found", 404);
  }
  if (notification.account.toString() !== user.account.toString()) {
    throw new AppError(
      "You are not authorized to mark this notification as read",
      403
    );
  }
  notification.read = true;
  await notification.save();
};

// Get all notifications for a user
const getAllNotifications = async (user) => {
  const account = await authRepository.findAccountByIdForNotifications(user.account);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  return account.notifications;
};

const createNotification = async (notificationData, accountId) => {
  notificationData.account = accountId;
  const notification = await notificationRepository.createNotification(
    notificationData
  );
  const account = await authRepository.findAccountById(accountId);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  account.notifications.push(notification);
  await account.save();
  return notification;
};

module.exports = {
  markNotificationAsRead,
  getAllNotifications,
  createNotification
};

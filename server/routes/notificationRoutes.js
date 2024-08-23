const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/isLogin");
const notificationController = require("../controllers/notificationController");

// Route to mark a notification as read
router.route("/mark-as-read/:notificationId").put(
  isLogin,
  notificationController.markNotificationAsRead
);

// Route to get all notifications for a user
router.route("/get-notifications").get(
  isLogin,
  notificationController.getAllNotifications
);

module.exports = router;
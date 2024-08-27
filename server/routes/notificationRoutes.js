const express = require("express");
const router = express.Router();

// Controller
const notificationController = require("../controllers/notificationController");

// Middleware
const { isLogin } = require("../middlewares/isLogin");

// --- Notification Routes ---

/**
 * @route  PUT /api/notifications/mark-as-read/:notificationId
 * @desc   Mark a notification as read
 * @access Private
 */
router.put(
  "/mark-as-read/:notificationId",
  isLogin,
  notificationController.markNotificationAsRead
);

/**
 * @route  GET /api/notifications/get-notifications
 * @desc   Get all notifications for the logged-in user
 * @access Private
 */
router.get(
  "/get-notifications",
  isLogin,
  notificationController.getAllNotifications
);

module.exports = router;

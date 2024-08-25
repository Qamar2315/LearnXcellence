const express = require("express");
const router = express.Router();

// Controller for handling notification-related logic
const notificationController = require("../controllers/notificationController");

// Middleware for user authentication
const { isLogin } = require("../middlewares/isLogin");

// --- Notification Routes ---

// Mark a notification as read (requires authentication)
router.put(
  "/mark-as-read/:notificationId", // Route parameter for the notification ID
  isLogin,                          // Ensure the user is logged in
  notificationController.markNotificationAsRead // Controller function to handle marking as read
);

// Get all notifications for the logged-in user
router.get(
  "/get-notifications",      
  isLogin,                          // Ensure the user is logged in
  notificationController.getAllNotifications // Controller function to retrieve notifications
);

module.exports = router;
// Load environment variables from .env file
require("dotenv").config();

// Core Modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Custom Middlewares
const { notFound, errorHandler } = require("./middlewares/ErrorHandler");

// Importing Routes
const courseRoutes = require("./routes/courseRoutes");
const projectRoutes = require("./routes/projectRoutes");
const remarkRoutes = require("./routes/remarkRoutes");
const statusRoutes = require("./routes/statusRoutes");
const vivaRoutes = require("./routes/vivaRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const authRoutes = require("./routes/authRoutes");
const proctoringRoutes = require("./routes/proctoringRoutes");
const quizRoutes = require("./routes/quizRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const pollRoutes = require("./routes/pollRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Initialize Express App
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/remarks", remarkRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/viva", vivaRoutes);
app.use("/api/announcements", announcementRoutes); // Fixed typo
app.use("/api/ai-proctoring", proctoringRoutes); // Fixed typo
app.use("/api/quiz", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Database Connection Function
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
}

// Connect to Database
connectToDatabase();

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, we can exit the process to avoid undefined behavior
  process.exit(1);
});

// Start the Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});

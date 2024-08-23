// Initialize Express App
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { notFound, errorHandler } = require("./middlewares/ErrorHandler");

// Importing Routes
const courseRoutes = require("./routes/courseRoutes");
const projectRoutes = require("./routes/projectRoutes");
const remarkRoutes = require("./routes/remarkRoutes");
const statusRoutes = require("./routes/statusRoutes");
const vivaRoutes = require("./routes/vivaRoutes");
const annoucementRoutes = require("./routes/annoucementRoutes");
const authRoutes = require("./routes/authRoutes");
const proctoringRoutes = require("./routes/proctoringRoutes");
const quizRoutes = require("./routes/quizRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const pollRoutes = require("./routes/pollRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load environment variables from .env file
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/remarks", remarkRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/viva", vivaRoutes);
app.use("/api/announcements", annoucementRoutes);
app.use("/api/ai-protoring", proctoringRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Database Connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("connected");
}

// Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});

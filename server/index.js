// Load environment variables from .env file
require("dotenv").config();

// Core Modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express App
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Importing Routes
const routes = require("./routes"); // Assuming routes are centralized

// API Routes
app.use("/api", routes);

// Custom Middlewares
const { notFound, errorHandler } = require("./middlewares/ErrorHandler");

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

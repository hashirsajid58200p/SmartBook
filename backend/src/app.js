const express = require("express");
const cors = require("cors");
const path = require("path"); // Path module lazmi hai
const dotenv = require("dotenv");
const meetingRoutes = require("../routes/meetingRoutes");

// .env ka rasta: 1 level up (backend), 2 levels up (SmartBook root)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// --- DEBUGGING: Check karne ke liye ke key mili ya nahi ---
console.log("-----------------------------------------");
console.log(
  "WHEREBY_API_KEY Load Hui?:",
  process.env.WHEREBY_API_KEY ? "Yes ✅" : "No ❌"
);
console.log("-----------------------------------------");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/meetings", meetingRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("SmartBook Backend is Running!");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;

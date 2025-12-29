const express = require("express");
const router = express.Router();
const { createMeeting } = require("../controllers/meetingController");

// Ye endpoint aapke frontend script mein use ho raha hai
router.post("/create", createMeeting);

module.exports = router;

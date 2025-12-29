/**
 * MEETING CONTROLLER
 * Handles the logic for creating rooms and sending links to the frontend.
 */
const wherebyService = require("../services/wherebyService");

const createMeeting = async (req, res) => {
  try {
    console.log("Request received to create a new Whereby meeting...");

    // Whereby service ko call karein naye links ke liye
    const meetingData = await wherebyService.createMeeting();

    // Agar data mil jaye toh frontend ko success response bhejen
    if (meetingData && meetingData.roomUrl) {
      console.log("Meeting created successfully: ", meetingData.roomUrl);

      return res.status(200).json({
        success: true,
        roomUrl: meetingData.roomUrl, // Participants ke liye
        hostUrl: meetingData.hostRoomUrl, // Moderator/Host ke liye
        meetingId: meetingData.meetingId,
      });
    } else {
      throw new Error("Invalid response from Whereby service");
    }
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error: Meeting generate nahi ho saki.",
      error: error.message,
    });
  }
};

module.exports = {
  createMeeting,
};

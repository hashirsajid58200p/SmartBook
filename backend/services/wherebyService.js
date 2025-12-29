/**
 * WHEREBY SERVICE
 * Handles communication with the Whereby REST API to generate dynamic meeting rooms.
 */

const axios = require("axios");

/**
 * Generates a new meeting room via Whereby API
 * @returns {Promise<Object>} Meeting data containing roomUrl and hostRoomUrl
 */
const createMeeting = async () => {
  try {
    // API Key ko environment variables se uthana hai
    const API_KEY = process.env.WHEREBY_API_KEY;

    if (!API_KEY) {
      throw new Error("WHEREBY_API_KEY is missing in .env file");
    }

    // Meeting ki expiry set karna (Example: Ab se 24 ghante baad)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // API Request Body
    const data = {
      endDate: expiryDate.toISOString(), // ISO 8601 format lazmi hai
      isLocked: true, // Takay guests ko enter hone ke liye host ki permission chahiye ho
      roomMode: "normal", // 'normal' for up to 12 people, 'group' for up to 200
      fields: ["hostRoomUrl"], // Hamein host ka alag link chahiye moderator rights ke liye
    };

    // Whereby API ko request bhejna
    const response = await axios.post(
      "https://api.whereby.dev/v1/meetings",
      data,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    /**
     * Response mein milne wala data:
     * meetingId: Room ki unique ID
     * roomUrl: Participants ka link
     * hostRoomUrl: Host (Aapka) link
     * startDate: Meeting shuru hone ka waqt
     * endDate: Meeting khatam hone ka waqt
     */
    return response.data;
  } catch (error) {
    // Error handling agar API fail ho jaye
    console.error(
      "Whereby Service Error Details:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response
        ? error.response.data.detail
        : "Failed to generate meeting link"
    );
  }
};

module.exports = {
  createMeeting,
};

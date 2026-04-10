const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const slots = body.slots;

    if (!Array.isArray(slots)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid slots payload" }),
      };
    }

    const store = getStore("wollaston-bookings");
    await store.setJSON("slots", slots);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to save bookings" }),
    };
  }
};

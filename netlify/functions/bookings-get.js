const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("wollaston-bookings");
    const data = await store.get("slots", { type: "json" });

    return {
      statusCode: 200,
      body: JSON.stringify({
        slots: data || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to load bookings" }),
    };
  }
};

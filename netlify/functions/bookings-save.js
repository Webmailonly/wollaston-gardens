const { getStore } = require("@netlify/blobs");

function getBookingsStore() {
  return getStore({
    name: "wollaston-bookings",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!Array.isArray(body.slots)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing slots array" }),
      };
    }

    const activeBookings = body.slots.filter((slot) =>
      ["pending", "approved"].includes(slot.status)
    );

    const store = getBookingsStore();

    await store.setJSON("bookings", {
      slots: activeBookings,
      updatedAt: new Date().toISOString(),
    });

    console.log("ACTIVE BOOKINGS SAVED:", activeBookings.length);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: activeBookings.length,
      }),
    };
  } catch (error) {
    console.error("BOOKINGS SAVE ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Save failed",
      }),
    };
  }
};

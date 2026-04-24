const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const body = JSON.parse(event.body || "{}");

    if (!Array.isArray(body.slots)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing slots array" }) };
    }

    const store = getStore("wollaston-bookings");

    await store.setJSON("bookings", {
      slots: body.slots,
      updatedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Save failed" }),
    };
  }
};

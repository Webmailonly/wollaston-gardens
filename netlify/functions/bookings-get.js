const { getStore } = require("@netlify/blobs");

function getBookingsStore() {
  return getStore({
    name: "wollaston-bookings",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
}

exports.handler = async () => {
  try {
    const store = getBookingsStore();
    const data = await store.get("bookings", { type: "json" });

    const slots = data?.slots || [];

    console.log("ACTIVE BOOKINGS LOADED:", slots.length);

    return {
      statusCode: 200,
      body: JSON.stringify({
        slots,
        updatedAt: data?.updatedAt || null,
      }),
    };
  } catch (error) {
    console.error("BOOKINGS GET ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        slots: [],
        error: error.message || "Load failed",
      }),
    };
  }
};

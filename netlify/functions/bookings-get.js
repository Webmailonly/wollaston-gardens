const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("wollaston-bookings");
    const data = await store.get("bookings", { type: "json" });

    console.log("BOOKINGS LOADED:", data?.slots?.length || 0);

    return {
      statusCode: 200,
      body: JSON.stringify({
        slots: data?.slots || [],
        updatedAt: data?.updatedAt || null,
      }),
    };
  } catch (error) {
    console.error("BOOKINGS GET ERROR:", error);

    return {
      statusCode: 200,
      body: JSON.stringify({
        slots: [],
        error: error.message || "Load failed",
      }),
    };
  }
};

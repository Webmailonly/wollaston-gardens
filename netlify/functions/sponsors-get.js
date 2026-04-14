const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("wollaston-sponsors");
    const sponsors = (await store.get("sponsors", { type: "json" })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ sponsors }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Unable to load sponsors",
      }),
    };
  }
};

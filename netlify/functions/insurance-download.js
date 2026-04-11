const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const bookingId = event.queryStringParameters?.bookingId;

    if (!bookingId) {
      return {
        statusCode: 400,
        body: "Missing bookingId",
      };
    }

    const store = getStore("wollaston-bookings");
    const file = await store.get(`insurance-${bookingId}`, { type: "json" });

    if (!file) {
      return {
        statusCode: 404,
        body: "Insurance file not found",
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": file.fileType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.fileName || "insurance-file"}"`,
      },
      body: file.data,
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Insurance download failed: ${error.message}`,
    };
  }
};

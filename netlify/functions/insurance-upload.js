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
    const { bookingId, email, fileName, fileType, fileDataBase64 } = body;

    if (!bookingId || !email || !fileName || !fileDataBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required upload fields" }),
      };
    }

    const store = getStore("wollaston-bookings");
    const slots = (await store.get("slots", { type: "json" })) || [];

    const target = slots.find(
      (slot) =>
        String(slot.id) === String(bookingId) &&
        String(slot.email || "").toLowerCase() === String(email).toLowerCase() &&
        slot.status === "approved"
    );

    if (!target) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Approved booking not found for that booking ID and email",
        }),
      };
    }

    const uploadedAt = new Date().toISOString();

    await store.setJSON(`insurance-${bookingId}`, {
      bookingId,
      email,
      fileName,
      fileType: fileType || "application/octet-stream",
      data: fileDataBase64,
      uploadedAt,
    });

    const updatedSlots = slots.map((slot) =>
      String(slot.id) === String(bookingId)
        ? {
            ...slot,
            insuranceUploaded: true,
            insuranceFileName: fileName,
            insuranceUploadedAt: uploadedAt,
          }
        : slot
    );

    await store.setJSON("slots", updatedSlots);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Insurance upload failed",
      }),
    };
  }
};

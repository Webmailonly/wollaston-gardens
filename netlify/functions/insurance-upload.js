exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const {
      bookingId,
      email,
      fileName,
      fileType,
      fileDataBase64,
    } = body;

    if (!bookingId || !email || !fileName || !fileDataBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required upload fields" }),
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL || "info@thewollastongardens.com";

    if (!resendApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing RESEND_API_KEY" }),
      };
    }

    if (!fromEmail) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing FROM_EMAIL" }),
      };
    }

    const html = `
      <h2>Insurance Upload Received</h2>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Vendor Email:</strong> ${email}</p>
      <p><strong>File Name:</strong> ${fileName}</p>
      <p>The insurance document is attached to this email for admin review.</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `Insurance Upload - Booking ${bookingId} - Wollaston Gardens`,
        html,
        attachments: [
          {
            filename: fileName,
            content: fileDataBase64,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to send insurance email");
    }

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

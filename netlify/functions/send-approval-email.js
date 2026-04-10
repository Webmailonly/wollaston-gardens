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
      truck,
      contactName,
      email,
      cuisine,
      slotLabel,
      displayDate,
      displayTime,
      depositText,
      paymentLink,
    } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

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

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing vendor email" }),
      };
    }

    const vendorHtml = `
      <h2>Your Booking Has Been Approved</h2>
      <p>Hello ${contactName || "Vendor"},</p>
      <p>Your booking for <strong>Wollaston Gardens</strong> has been approved.</p>
      <p><strong>Truck:</strong> ${truck || ""}</p>
      <p><strong>Cuisine:</strong> ${cuisine || ""}</p>
      <p><strong>Date:</strong> ${displayDate || ""}</p>
      <p><strong>Shift:</strong> ${displayTime || ""} (${slotLabel || ""})</p>
      <p><strong>Deposit:</strong> ${depositText || ""}</p>
      ${
        paymentLink
          ? `<p><a href="${paymentLink}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;">Pay Deposit</a></p>`
          : `<p>Please contact admin for your deposit payment link.</p>`
      }
      <p>Proof of insurance is required after approval and deposit payment.</p>
      <p>Thank you.</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Booking approved - ${displayDate || ""} - Wollaston Gardens`,
        html: vendorHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to send approval email");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Unknown server error",
      }),
    };
  }
};

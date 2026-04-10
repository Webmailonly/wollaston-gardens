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
      phone,
      cuisine,
      slotLabel,
      displayDate,
      displayTime,
      requirements,
    } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "info@thewollastongardens.com";
    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

    if (!resendApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing RESEND_API_KEY" }),
      };
    }

    const adminHtml = `
      <h2>New Food Truck Booking Request</h2>
      <p><strong>Truck:</strong> ${truck || ""}</p>
      <p><strong>Contact:</strong> ${contactName || ""}</p>
      <p><strong>Email:</strong> ${email || ""}</p>
      <p><strong>Phone:</strong> ${phone || ""}</p>
      <p><strong>Cuisine:</strong> ${cuisine || ""}</p>
      <p><strong>Date:</strong> ${displayDate || ""}</p>
      <p><strong>Shift:</strong> ${displayTime || ""} (${slotLabel || ""})</p>
      <p><strong>Requirements:</strong> ${requirements || "None provided"}</p>
      <p>Admin approval is required before this booking is confirmed.</p>
    `;

    const vendorHtml = `
      <h2>Your Booking Request Was Received</h2>
      <p>Thank you for submitting a booking request for <strong>Wollaston Gardens</strong>.</p>
      <p><strong>Truck:</strong> ${truck || ""}</p>
      <p><strong>Date:</strong> ${displayDate || ""}</p>
      <p><strong>Shift:</strong> ${displayTime || ""} (${slotLabel || ""})</p>
      <p><strong>Cuisine:</strong> ${cuisine || ""}</p>
      <p>Your request is pending admin review. We will contact you once it has been approved or declined.</p>
    `;

    const sendEmail = async ({ to, subject, html }) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send email");
      }

      return data;
    };

    await sendEmail({
      to: adminEmail,
      subject: `New booking request: ${truck || "Food Truck"} - ${displayDate || ""}`,
      html: adminHtml,
    });

    if (email) {
      await sendEmail({
        to: email,
        subject: `We received your booking request - Wollaston Gardens`,
        html: vendorHtml,
      });
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

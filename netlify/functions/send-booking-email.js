function normalizePhoneNumber(phone) {
  if (!phone) return "";

  const cleaned = String(phone).replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }

  if (String(phone).startsWith("+")) {
    return String(phone);
  }

  return "";
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const {
      truck,
      contactName,
      email,
      phone,
      cuisine,
      requirements,
      slotLabel,
      displayDate,
      displayTime,
      location,
    } = JSON.parse(event.body || "{}");

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL || "info@thewollastongardens.com";

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;
    const adminPhone = normalizePhoneNumber(process.env.ADMIN_PHONE_NUMBER);
    const vendorPhone = normalizePhoneNumber(phone);

    const bookingSummary = `
      <h2>New Booking Request</h2>
      <p><strong>Truck:</strong> ${truck || ""}</p>
      <p><strong>Contact:</strong> ${contactName || ""}</p>
      <p><strong>Email:</strong> ${email || ""}</p>
      <p><strong>Phone:</strong> ${phone || ""}</p>
      <p><strong>Cuisine:</strong> ${cuisine || ""}</p>
      <p><strong>Date:</strong> ${displayDate || ""}</p>
      <p><strong>Time:</strong> ${displayTime || ""}</p>
      <p><strong>Shift:</strong> ${slotLabel || ""}</p>
      <p><strong>Location:</strong> ${location || "Wollaston Gardens"}</p>
      <p><strong>Notes:</strong> ${requirements || "None"}</p>
    `;

    const vendorHtml = `
      <h2>We received your booking request</h2>
      <p>Hello ${contactName || truck || "there"},</p>
      <p>Thank you for submitting a booking request for Wollaston Gardens.</p>
      <p>Your request has been received and is pending admin approval.</p>

      <h3>Request Details</h3>
      <p><strong>Truck:</strong> ${truck || ""}</p>
      <p><strong>Date:</strong> ${displayDate || ""}</p>
      <p><strong>Time:</strong> ${displayTime || ""}</p>
      <p><strong>Shift:</strong> ${slotLabel || ""}</p>
      <p><strong>Cuisine:</strong> ${cuisine || ""}</p>

      <p>You will receive another notification once your request has been reviewed.</p>
      <p>Thank you,<br />Wollaston Gardens</p>
    `;

    const results = [];

    if (resendApiKey && fromEmail) {
      const adminEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: adminEmail,
          subject: `New Booking Request - ${truck || "Vendor"}`,
          html: bookingSummary,
        }),
      });

      results.push({
        type: "admin_email",
        ok: adminEmailResponse.ok,
        status: adminEmailResponse.status,
      });

      if (email) {
        const vendorEmailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            subject: "Your Wollaston Gardens booking request was received",
            html: vendorHtml,
          }),
        });

        results.push({
          type: "vendor_email",
          ok: vendorEmailResponse.ok,
          status: vendorEmailResponse.status,
        });
      }
    }

    if (twilioSid && twilioToken && twilioFrom) {
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      if (adminPhone) {
        const adminText = `New Wollaston Gardens booking request: ${truck || "Vendor"} for ${displayDate || ""} ${displayTime || ""}. Check admin dashboard.`;

        const adminSmsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: twilioFrom,
              To: adminPhone,
              Body: adminText,
            }),
          }
        );

        results.push({
          type: "admin_sms",
          ok: adminSmsResponse.ok,
          status: adminSmsResponse.status,
        });
      }

      if (vendorPhone) {
        const vendorText = `Wollaston Gardens received your booking request for ${displayDate || ""} ${displayTime || ""}. Your request is pending approval.`;

        const vendorSmsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: twilioFrom,
              To: vendorPhone,
              Body: vendorText,
            }),
          }
        );

        results.push({
          type: "vendor_sms",
          ok: vendorSmsResponse.ok,
          status: vendorSmsResponse.status,
          to: vendorPhone,
        });
      } else if (phone) {
        results.push({
          type: "vendor_sms",
          ok: false,
          status: "invalid_phone",
          originalPhone: phone,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        results,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Notification failed",
      }),
    };
  }
};

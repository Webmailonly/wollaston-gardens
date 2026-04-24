function normalizePhoneNumber(phone) {
  if (!phone) return "";

  const raw = String(phone).trim();
  if (raw.startsWith("+")) return raw;

  const cleaned = raw.replace(/\D/g, "");

  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11 && cleaned.startsWith("1")) return `+${cleaned}`;

  return "";
}

async function sendEmail({ apiKey, from, to, subject, html }) {
  if (!apiKey || !from || !to) {
    return { ok: false, reason: "missing_email_config", to };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    to,
    response: text,
  };
}

async function sendSms({ sid, token, from, to, body }) {
  if (!sid || !token || !from || !to) {
    return { ok: false, reason: "missing_sms_config", to };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: to,
        Body: body,
      }),
    }
  );

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    to,
    response: text,
  };
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
    const adminEmail =
      process.env.ADMIN_EMAIL || "info@thewollastongardens.com";

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = normalizePhoneNumber(process.env.TWILIO_FROM_NUMBER);

    const adminPhone = normalizePhoneNumber(
      process.env.ADMIN_PHONE_NUMBER || process.env.ADMIN_PHONE
    );

    const vendorPhone = normalizePhoneNumber(phone);

    const adminHtml = `
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

    results.push({
      type: "admin_email",
      ...(await sendEmail({
        apiKey: resendApiKey,
        from: fromEmail,
        to: adminEmail,
        subject: `New Booking Request - ${truck || "Vendor"}`,
        html: adminHtml,
      })),
    });

    if (email) {
      results.push({
        type: "vendor_email",
        ...(await sendEmail({
          apiKey: resendApiKey,
          from: fromEmail,
          to: email,
          subject: "Your Wollaston Gardens booking request was received",
          html: vendorHtml,
        })),
      });
    }

    results.push({
      type: "admin_sms",
      ...(await sendSms({
        sid: twilioSid,
        token: twilioToken,
        from: twilioFrom,
        to: adminPhone,
        body: `New Wollaston Gardens booking request: ${truck || "Vendor"} for ${displayDate || ""} ${displayTime || ""}.`,
      })),
    });

    if (vendorPhone) {
      results.push({
        type: "vendor_sms",
        ...(await sendSms({
          sid: twilioSid,
          token: twilioToken,
          from: twilioFrom,
          to: vendorPhone,
          body: `Wollaston Gardens received your booking request for ${displayDate || ""} ${displayTime || ""}. Your request is pending approval.`,
        })),
      });
    } else {
      results.push({
        type: "vendor_sms",
        ok: false,
        reason: "invalid_vendor_phone",
        originalPhone: phone || "",
      });
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

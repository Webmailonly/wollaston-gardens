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

  return {
    ok: response.ok,
    status: response.status,
    to,
    response: await response.text(),
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

  return {
    ok: response.ok,
    status: response.status,
    to,
    response: await response.text(),
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

    const data = JSON.parse(event.body || "{}");

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    const adminEmail =
      process.env.ADMIN_EMAIL || "info@thewollastongardens.com";

    const adminPhone = normalizePhoneNumber(
      process.env.ADMIN_PHONE_NUMBER ||
        process.env.ADMIN_PHONE ||
        "+16179030736"
    );

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = normalizePhoneNumber(process.env.TWILIO_FROM_NUMBER);

    const vendorPhone = normalizePhoneNumber(data.phone);

    const vendorHtml = `
      <h2>Your booking has been approved</h2>
      <p>Hello ${data.contactName || data.truck || "there"},</p>
      <p>Your Wollaston Gardens booking request has been approved.</p>
      <p><strong>Booking ID:</strong> ${data.bookingId || ""}</p>
      <p><strong>Truck:</strong> ${data.truck || ""}</p>
      <p><strong>Date:</strong> ${data.displayDate || ""}</p>
      <p><strong>Time:</strong> ${data.displayTime || ""}</p>
      <p><strong>Shift:</strong> ${data.slotLabel || ""}</p>
      <p><strong>Cuisine:</strong> ${data.cuisine || ""}</p>
      <p>Please upload proof of insurance within 48 hours using the upload section on the vendor site.</p>
      <p>Thank you,<br />Wollaston Gardens</p>
    `;

    const adminHtml = `
      <h2>Booking Approved</h2>
      <p><strong>Truck:</strong> ${data.truck || ""}</p>
      <p><strong>Contact:</strong> ${data.contactName || ""}</p>
      <p><strong>Email:</strong> ${data.email || ""}</p>
      <p><strong>Phone:</strong> ${data.phone || ""}</p>
      <p><strong>Cuisine:</strong> ${data.cuisine || ""}</p>
      <p><strong>Date:</strong> ${data.displayDate || ""}</p>
      <p><strong>Time:</strong> ${data.displayTime || ""}</p>
      <p><strong>Shift:</strong> ${data.slotLabel || ""}</p>
    `;

    const results = [];

    if (data.email) {
      results.push({
        type: "vendor_approval_email",
        ...(await sendEmail({
          apiKey: resendApiKey,
          from: fromEmail,
          to: data.email,
          subject: "Your Wollaston Gardens booking has been approved",
          html: vendorHtml,
        })),
      });
    }

    results.push({
      type: "admin_approval_email",
      ...(await sendEmail({
        apiKey: resendApiKey,
        from: fromEmail,
        to: adminEmail,
        subject: `Booking Approved - ${data.truck || "Vendor"}`,
        html: adminHtml,
      })),
    });

    if (vendorPhone) {
      results.push({
        type: "vendor_approval_sms",
        ...(await sendSms({
          sid: twilioSid,
          token: twilioToken,
          from: twilioFrom,
          to: vendorPhone,
          body: `Your Wollaston Gardens booking for ${data.displayDate || ""} ${data.displayTime || ""} has been approved. Please upload proof of insurance within 48 hours.`,
        })),
      });
    }

    results.push({
      type: "admin_approval_sms",
      ...(await sendSms({
        sid: twilioSid,
        token: twilioToken,
        from: twilioFrom,
        to: adminPhone,
        body: `Booking approved: ${data.truck || "Vendor"} for ${data.displayDate || ""} ${data.displayTime || ""}.`,
      })),
    });

    console.log("NOTIFICATION RESULTS:", JSON.stringify(results, null, 2));

return {
  statusCode: 200,
  body: JSON.stringify({ success: true, results }),
};
  catch (error) {
  console.error("NOTIFICATION ERROR:", error);

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: error.message || "Notification failed",
    }),
  };
}
};

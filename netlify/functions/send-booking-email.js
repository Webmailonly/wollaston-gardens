exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    const {
      truck,
      contactName,
      email,
      phone,
      cuisine,
      displayDate,
      displayTime,
      location,
    } = data;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPhone = process.env.ADMIN_PHONE;

    // --- SEND EMAIL ---
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `New Booking Request - ${truck}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Truck:</strong> ${truck}</p>
          <p><strong>Contact:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Cuisine:</strong> ${cuisine}</p>
          <p><strong>Date:</strong> ${displayDate}</p>
          <p><strong>Time:</strong> ${displayTime}</p>
          <p><strong>Location:</strong> ${location}</p>
        `,
      }),
    });

    // --- SEND SMS ---
    if (adminPhone) {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_FROM_NUMBER;

      const auth = Buffer.from(`${sid}:${token}`).toString("base64");

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: from,
            To: adminPhone,
            Body: `New Booking: ${truck} | ${displayDate} | ${displayTime} | ${location}`,
          }),
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

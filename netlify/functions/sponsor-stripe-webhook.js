const Stripe = require("stripe");
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.SPONSOR_STRIPE_WEBHOOK_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL || "info@thewollastongardens.com";

    if (!stripeKey || !webhookSecret) {
      return {
        statusCode: 500,
        body: "Missing Stripe webhook configuration",
      };
    }

    const stripe = new Stripe(stripeKey);
    const signature =
      event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      webhookSecret
    );

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const metadata = session.metadata || {};

      if (metadata.sponsorType === "wollaston_sponsor") {
        const store = getStore("wollaston-sponsors");
        const existing = (await store.get("sponsors", { type: "json" })) || [];

        const sponsorRecord = {
          id: session.id,
          status: "paid",
          paidAt: new Date().toISOString(),
          amountTotal: session.amount_total || 0,
          tierId: metadata.tierId || "",
          tierLabel: metadata.tierLabel || "",
          companyName: metadata.companyName || "",
          contactName: metadata.contactName || "",
          email: metadata.email || "",
          phone: metadata.phone || "",
          website: metadata.website || "",
          notes: metadata.notes || "",
          month: metadata.month || "",
          weekendStart: metadata.weekendStart || "",
          weekendEnd: metadata.weekendEnd || "",
          weekendLabel: metadata.weekendLabel || "",
        };

        const updatedSponsors = [
          ...existing.filter((item) => item.id !== session.id),
          sponsorRecord,
        ];

        await store.setJSON("sponsors", updatedSponsors);

        if (resendApiKey && fromEmail) {
          const adminHtml = `
            <h2>Sponsor Payment Received</h2>
            <p><strong>Company:</strong> ${sponsorRecord.companyName}</p>
            <p><strong>Contact:</strong> ${sponsorRecord.contactName}</p>
            <p><strong>Email:</strong> ${sponsorRecord.email}</p>
            <p><strong>Tier:</strong> ${sponsorRecord.tierLabel}</p>
            <p><strong>Month:</strong> ${sponsorRecord.month || "N/A"}</p>
            <p><strong>Weekend:</strong> ${sponsorRecord.weekendLabel || "N/A"}</p>
            <p><strong>Amount Paid:</strong> $${((sponsorRecord.amountTotal || 0) / 100).toFixed(2)}</p>
          `;

          const sponsorHtml = `
            <h2>Thank You for Sponsoring Wollaston Gardens</h2>
            <p>Hello ${sponsorRecord.contactName || sponsorRecord.companyName},</p>
            <p>Your sponsorship payment has been received successfully.</p>
            <p><strong>Tier:</strong> ${sponsorRecord.tierLabel}</p>
            <p><strong>Month:</strong> ${sponsorRecord.month || "N/A"}</p>
            <p><strong>Weekend:</strong> ${sponsorRecord.weekendLabel || "N/A"}</p>
            <p>We’ll follow up with any next steps for artwork, placement, and promotion details.</p>
            <p>Thank you.</p>
          `;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: adminEmail,
              subject: `Sponsor Payment Received - ${sponsorRecord.companyName}`,
              html: adminHtml,
            }),
          });

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: sponsorRecord.email,
              subject: `Thank You for Sponsoring Wollaston Gardens`,
              html: sponsorHtml,
            }),
          });
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
};

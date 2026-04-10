const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;

    if (!stripeSecretKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
      };
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = JSON.parse(event.body || "{}");
    const {
      bookingId,
      vendorEmail,
      truck,
      displayDate,
      displayTime,
      amountCents,
    } = body;

    if (!bookingId || !vendorEmail || !amountCents) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required checkout fields" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: vendorEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Deposit - ${truck || "Food Truck"} - ${displayDate || ""}`,
              description: `${displayTime || ""} at Wollaston Gardens`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: String(bookingId),
      },
      success_url: `${siteUrl}?payment=success`,
      cancel_url: `${siteUrl}?payment=cancelled`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: session.url,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to create checkout session" }),
    };
  }
};

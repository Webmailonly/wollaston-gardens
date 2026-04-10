const Stripe = require("stripe");
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      return {
        statusCode: 500,
        body: "Missing Stripe secrets",
      };
    }

    const stripe = new Stripe(stripeSecretKey);

    const signature =
      event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

    if (!signature) {
      return {
        statusCode: 400,
        body: "Missing Stripe signature",
      };
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      webhookSecret
    );

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const store = getStore("wollaston-bookings");
        const slots = (await store.get("slots", { type: "json" })) || [];

        const updatedSlots = slots.map((slot) =>
          String(slot.id) === String(bookingId)
            ? {
                ...slot,
                depositReceived: true,
              }
            : slot
        );

        await store.setJSON("slots", updatedSlots);
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

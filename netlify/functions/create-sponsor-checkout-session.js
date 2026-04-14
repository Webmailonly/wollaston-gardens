const Stripe = require("stripe");

const TIER_CONFIG = {
  season: {
    label: "Tier 1 – Season Sponsor",
    amountCents: 350000,
  },
  monthly: {
    label: "Tier 2 – Monthly Sponsor",
    amountCents: 100000,
  },
  weekend: {
    label: "Tier 3 – Single Weekend Sponsor",
    amountCents: 50000,
  },
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;

    if (!stripeKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
      };
    }

    const stripe = new Stripe(stripeKey);
    const body = JSON.parse(event.body || "{}");

    const {
      tierId,
      companyName,
      contactName,
      email,
      phone,
      website,
      notes,
      month,
      weekendStart,
      weekendEnd,
      weekendLabel,
    } = body;

    if (!tierId || !companyName || !contactName || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required sponsor fields" }),
      };
    }

    const tier = TIER_CONFIG[tierId];

    if (!tier) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid sponsorship tier" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${siteUrl}/sponsors?success=1`,
      cancel_url: `${siteUrl}/sponsors?canceled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: tier.amountCents,
            product_data: {
              name: tier.label,
              description:
                tierId === "season"
                  ? "Full season sponsorship"
                  : tierId === "monthly"
                  ? `Monthly sponsorship for ${month || ""}`
                  : `Weekend sponsorship for ${weekendLabel || ""}`,
            },
          },
        },
      ],
      metadata: {
        sponsorType: "wollaston_sponsor",
        tierId,
        tierLabel: tier.label,
        companyName,
        contactName,
        email,
        phone: phone || "",
        website: website || "",
        notes: notes || "",
        month: month || "",
        weekendStart: weekendStart || "",
        weekendEnd: weekendEnd || "",
        weekendLabel: weekendLabel || "",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Unable to create sponsor checkout",
      }),
    };
  }
};

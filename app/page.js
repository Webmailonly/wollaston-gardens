export default function WhyWollastonGardensPage() {
  const sponsorTiers = [
    {
      title: "Season Sponsor",
      price: "$3,500+",
      items: [
        "Logo on calendar page",
        "Featured placement on fence wrap",
        "Mention on all marketing and social media",
        "Beer coasters for three weekends",
        "Included in launch digital and print advertising",
      ],
    },
    {
      title: "Monthly Sponsor",
      price: "$1,000",
      items: [
        "All month long",
        "A-frame at entrance",
        "Calendar placement plus social media thank you",
        "Beer coasters for one weekend",
      ],
    },
    {
      title: "Single Weekend Sponsor",
      price: "$500",
      items: [
        "4-day sponsorship",
        "A-frame at entrance",
        "Calendar placement plus social media thank you",
      ],
    },
  ];

  const highlights = [
    {
      title: "Prime Quincy Visibility",
      text: "Position your brand in a destination setting steps from Wollaston Station and surrounded by local foot traffic.",
    },
    {
      title: "Recurring Seasonal Exposure",
      text: "Sponsors benefit from repeat impressions across the full summer-fall operating season, not just one isolated event.",
    },
    {
      title: "On-Site + Digital Presence",
      text: "Your sponsorship works both on the ground and online through the public calendar, venue marketing, and social content.",
    },
    {
      title: "Community-Oriented Brand Fit",
      text: "Align your brand with local gathering, food culture, entertainment, and a memorable Quincy experience.",
    },
  ];

  const audiencePoints = [
    "Downtown Wollaston location near the MBTA Red Line",
    "Evening and weekend traffic pattern",
    "Food trucks, live entertainment, and community atmosphere",
    "Season-long visibility from summer through fall 2026",
  ];

  return (
    <main
      style={{
        background: "#0b0d10",
        minHeight: "100vh",
        color: "#f8fafc",
      }}
    >
      <section
        style={{
          padding: "64px 24px 40px",
          background: "#0b0d10",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.12fr 0.88fr",
              gap: 28,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding: "42px 38px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(201,168,107,0.12)",
                  border: "1px solid rgba(201,168,107,0.3)",
                  color: "#d6b26d",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                Sponsorship Opportunities
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 66,
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  maxWidth: 760,
                  textTransform: "uppercase",
                }}
              >
                Put Your
                <br />
                Brand at
                <br />
                Wollaston
                <br />
                Gardens
              </h1>

              <p
                style={{
                  margin: "26px 0 0",
                  maxWidth: 720,
                  fontSize: 20,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                Reach a local Quincy audience through a premium outdoor food and
                night market experience featuring food trucks, entertainment,
                community traffic, and recurring seasonal visibility.
              </p>

              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="https://sponsors.thewollastongardens.com"
                  style={primaryButton}
                >
                  View Sponsorship Packages
                </a>
                <a href="/calendar" style={secondaryButtonDark}>
                  View Public Calendar
                </a>
              </div>

              <div
                style={{
                  marginTop: 22,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.8,
                }}
              >
                Limited sponsor placements available by weekend, month, and season.
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: 520,
                background:
                  "linear-gradient(180deg, rgba(10,12,16,0.2), rgba(10,12,16,0.5)), url('/why/wg-photo-page-1.jpeg') center/cover no-repeat",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "auto 24px 24px 24px",
                  background: "rgba(11,13,16,0.74)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#d6b26d",
                    marginBottom: 10,
                  }}
                >
                  Brand Exposure
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 10,
                  }}
                >
                  A sponsor experience built around visibility, atmosphere, and repeat impressions.
                </div>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.76)",
                  }}
                >
                  From calendar placement to on-site presence, the venue gives sponsors a
                  polished and community-facing platform.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: 24,
          }}
        >
          <div style={darkCard}>
            <div style={eyebrow}>Why It Works</div>
            <h2 style={lightTitle}>
              A strong local venue with recurring reasons for people to show up
            </h2>
            <p style={lightText}>
              Wollaston Gardens combines location, programming, and seasonal
              consistency into a sponsorship opportunity that feels local,
              visible, and easy to understand. Sponsors are not just buying an ad.
              They’re becoming part of the venue experience.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }}
          >
            {audiencePoints.map((point) => (
              <div key={point} style={statCard}>
                <div style={statNumber}>•</div>
                <div style={statLabel}>{point}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "8px 24px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {highlights.map((item, index) => (
              <div key={item.title} style={featureCard}>
                <div style={featureIndex}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={featureTitle}>{item.title}</div>
                <div style={featureText}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 32px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 24,
          }}
        >
          <div
            style={{
              ...lightPanel,
              background:
                "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(248,250,252,0.96)), url('/why/wg-photo-page-13.jpeg') center/cover no-repeat",
            }}
          >
            <div style={sectionEyebrowDark}>Sponsorship Tiers</div>
            <h2 style={sectionTitleDark}>Simple packages with clear value</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
                marginTop: 18,
              }}
            >
              {sponsorTiers.map((tier) => (
                <div key={tier.title} style={tierCard}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "start",
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    <div style={tierTitle}>{tier.title}</div>
                    <div style={tierPrice}>{tier.price}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tier.items.map((item) => (
                      <div key={item} style={tierItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={darkCard}>
            <div style={eyebrow}>What Sponsors Receive</div>
            <h2 style={lightTitle}>On-site presence plus digital visibility</h2>
            <div style={darkPillGrid}>
              <div style={darkPill}>Calendar placement</div>
              <div style={darkPill}>Social media mention</div>
              <div style={darkPill}>On-site signage</div>
              <div style={darkPill}>Fence wrap opportunity</div>
              <div style={darkPill}>Beer coaster placements</div>
              <div style={darkPill}>Seasonal package options</div>
            </div>

            <p style={{ ...lightText, marginTop: 20 }}>
              The opportunity is designed to work for both larger presenting
              partners and smaller businesses looking for a strong single-weekend presence.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 56px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 30,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(201,168,107,0.14), rgba(15,23,42,0.95))",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
              }}
            >
              <div style={{ padding: "38px 34px" }}>
                <div style={eyebrow}>Act Now</div>
                <h2 style={lightTitle}>
                  Secure your sponsorship before the best placements are gone
                </h2>
                <p style={lightText}>
                  Weekend, monthly, and season-long placements are limited. If your
                  brand wants premium visibility at Wollaston Gardens, the best time
                  to reserve is now.
                </p>

                <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a
                    href="https://sponsors.thewollastongardens.com"
                    style={primaryButton}
                  >
                    Explore Sponsorship Opportunities
                  </a>
                  <a href="/calendar" style={secondaryButtonDark}>
                    View Calendar
                  </a>
                </div>

                <div
                  style={{
                    marginTop: 22,
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  info@thewollastongardens.com
                  <br />
                  (617) 903-0736
                  <br />
                  18 Beale St, Quincy, MA 02170
                </div>
              </div>

              <div
                style={{
                  minHeight: 420,
                  background:
                    "linear-gradient(180deg, rgba(10,12,16,0.18), rgba(10,12,16,0.52)), url('/why/wg-photo-page-14.jpeg') center/cover no-repeat",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 20px",
  borderRadius: 14,
  background: "#d6b26d",
  color: "#0b0d10",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
};

const secondaryButtonDark = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 20px",
  borderRadius: 14,
  background: "transparent",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  border: "1px solid rgba(255,255,255,0.16)",
};

const darkCard = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 28,
  padding: 26,
  boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
};

const lightPanel = {
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 28,
  padding: 26,
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
};

const statCard = {
  background: "#12161c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 22,
  boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
};

const statNumber = {
  fontSize: 34,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: "#d6b26d",
  marginBottom: 8,
};

const statLabel = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.78)",
};

const eyebrow = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#d6b26d",
  marginBottom: 12,
};

const lightTitle = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1.08,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#ffffff",
};

const lightText = {
  marginTop: 16,
  fontSize: 17,
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.78)",
};

const featureCard = {
  background: "#12161c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
};

const featureIndex = {
  fontSize: 13,
  fontWeight: 900,
  color: "#d6b26d",
  letterSpacing: ".08em",
  marginBottom: 14,
};

const featureTitle = {
  fontSize: 24,
  fontWeight: 800,
  color: "#ffffff",
  marginBottom: 10,
};

const featureText = {
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.76)",
};

const sectionEyebrowDark = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: 12,
};

const sectionTitleDark = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const darkPillGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 18,
};

const darkPill = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  fontSize: 14,
  fontWeight: 700,
  color: "#e2e8f0",
};

const tierCard = {
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 20,
  padding: 18,
  background: "#ffffff",
};

const tierTitle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
};

const tierPrice = {
  fontSize: 20,
  fontWeight: 900,
  color: "#b45309",
};

const tierItem = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#475569",
};

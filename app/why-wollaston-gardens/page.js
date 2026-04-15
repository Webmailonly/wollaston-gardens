export default function WhyWollastonGardensPage() {
  const benefits = [
    {
      title: "Prime Location",
      text: "Located in downtown Wollaston just steps from the MBTA Red Line and Hancock Street, with easy access from Boston and the South Shore.",
    },
    {
      title: "Built-In Foot Traffic",
      text: "Over 7,800 residents live within a 15-minute walk, plus steady commuter traffic from Wollaston Station and nearby neighborhood activity.",
    },
    {
      title: "Marketing Support",
      text: "Professionally branded and promoted venue with strong local visibility and seasonal exposure.",
    },
    {
      title: "Community Events",
      text: "Live music, food festivals, family days, and seasonal programming create repeat visits and a high-energy atmosphere.",
    },
    {
      title: "Flexible Scheduling",
      text: "Choose your preferred dates and build your season around your operating schedule.",
    },
    {
      title: "Growth Potential",
      text: "Introduce your business to a new audience and grow brand recognition in Quincy and the South Shore.",
    },
  ];

  const programming = [
    "Opening Weekend",
    "Food Festivals",
    "Live Music Nights",
    "Family Days",
    "Cultural Celebrations",
    "Seasonal Specials",
    "Closing Celebration",
  ];

  const requirements = [
    "Valid Permits",
    "Liability Insurance",
    "Food Safety Certification",
    "Equipment Standards",
    "Menu Variety",
    "Availability Commitment",
    "Professional Presentation",
  ];

  const mix = [
    "2–3 food trucks with diverse cuisines",
    "1–2 beverage vendors / reputable brewers",
    "1–2 dessert or sweet treat vendors",
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
              gridTemplateColumns: "1.15fr 0.85fr",
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
                backdropFilter: "blur(6px)",
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
                Summer–Fall 2026
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 68,
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  maxWidth: 720,
                  textTransform: "uppercase",
                }}
              >
                Why
                <br />
                Wollaston
                <br />
                Gardens
              </h1>

              <p
                style={{
                  margin: "26px 0 0",
                  maxWidth: 700,
                  fontSize: 20,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                Quincy’s outdoor food and night market is designed for visibility,
                energy, and repeat traffic. Vendors get access to a highly
                walkable location, built-in audience flow, curated programming,
                and a setting that feels elevated from the moment guests arrive.
              </p>

              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <a href="https://sponsors.thewollastongardens.com" style={primaryButton}>
  Become a Sponsor
</a>
                <a href="/calendar" style={secondaryButtonDark}>
                  View Public Calendar
                </a>
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: 520,
                background:
                  "linear-gradient(180deg, rgba(10,12,16,0.15), rgba(10,12,16,0.45)), url('/why/wg-photo-page-1.jpeg') center/cover no-repeat",
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
                  backdropFilter: "blur(8px)",
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
                  The Experience
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 10,
                  }}
                >
                  Food, lights, music, and a community crowd under the stars.
                </div>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.76)",
                  }}
                >
                  The venue is built to feel social, energetic, and memorable —
                  the kind of environment people return to all season.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 24,
            }}
          >
            <div style={darkCard}>
              <div style={eyebrow}>The Opportunity</div>
              <h2 style={lightTitle}>
                A standout destination in one of Quincy’s most accessible neighborhoods
              </h2>
              <p style={lightText}>
                Wollaston Gardens sits in the heart of downtown Wollaston, steps
                from the Red Line and surrounded by strong residential density.
                The concept blends food trucks, nightlife energy, and community
                programming into a venue that feels different from anything else
                in the area.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <div style={statCard}>
                <div style={statNumber}>7,800+</div>
                <div style={statLabel}>Residents within a 15-minute walk</div>
              </div>
              <div style={statCard}>
                <div style={statNumber}>MBTA</div>
                <div style={statLabel}>Steps from Wollaston Station</div>
              </div>
              <div style={statCard}>
                <div style={statNumber}>Thu–Sun</div>
                <div style={statLabel}>Evening and weekend operating focus</div>
              </div>
              <div style={statCard}>
                <div style={statNumber}>2026</div>
                <div style={statLabel}>Summer–fall seasonal opportunity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "8px 24px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {benefits.map((item, index) => (
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
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
          }}
        >
          <div style={lightPanel}>
            <div style={sectionEyebrowDark}>Operating Hours</div>
            <h2 style={sectionTitleDark}>Evening and weekend traffic by design</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 20,
              }}
            >
              <div style={innerPanel}>
                <div style={innerTitle}>Summer Season</div>
                <div style={innerBody}>May 15 – August 31, 2026</div>
                <div style={innerList}>Thursdays: 4PM – 9PM</div>
                <div style={innerList}>Fridays: 4PM – 10PM</div>
                <div style={innerList}>Saturdays: 12PM – 10PM</div>
                <div style={innerList}>Sundays: 12PM – 7PM</div>
              </div>

              <div style={innerPanel}>
                <div style={innerTitle}>Fall Season</div>
                <div style={innerBody}>September 1 – October 15, 2026</div>
                <div style={innerList}>Thursdays: 4PM – 9PM</div>
                <div style={innerList}>Fridays: 4PM – 10PM</div>
                <div style={innerList}>Saturdays: 12PM – 10PM</div>
                <div style={innerList}>Sundays: 12PM – 7PM</div>
              </div>
            </div>
          </div>

          <div style={darkCard}>
            <div style={eyebrow}>Event Programming</div>
            <h2 style={lightTitle}>Reasons people keep coming back</h2>
            <div style={darkPillGrid}>
              {programming.map((item) => (
                <div key={item} style={darkPill}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 32px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div style={darkCard}>
            <div style={eyebrow}>Vendor Mix Strategy</div>
            <h2 style={lightTitle}>Curated variety creates stronger demand</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              {mix.map((item) => (
                <div key={item} style={listItemDark}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              ...lightPanel,
              background:
                "linear-gradient(180deg, rgba(248,250,252,0.96), rgba(248,250,252,0.96)), url('/why/wg-photo-page-13.jpeg') center/cover no-repeat",
            }}
          >
            <div style={sectionEyebrowDark}>Vendor Requirements</div>
            <h2 style={sectionTitleDark}>What participating vendors need</h2>
            <div style={pillGridLight}>
              {requirements.map((item) => (
                <div key={item} style={pillLight}>
                  {item}
                </div>
              ))}
            </div>
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
                <div style={eyebrow}>Vendor Commitment</div>
                <h2 style={lightTitle}>
                  Structured enough to create momentum, flexible enough to scale with you
                </h2>
                <p style={lightText}>
                  Vendors who show up consistently build recognition, repeat
                  business, and stronger local traction. The platform is designed
                  to reward reliability, quality, and community engagement.
                </p>

                <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="https://sponsors.thewollastongardens.com" style={primaryButton}>
  View Sponsorship Packages
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

const innerPanel = {
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 20,
  padding: 18,
  background: "#ffffff",
};

const innerTitle = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: 8,
};

const innerBody = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
  marginBottom: 6,
};

const innerList = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
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

const listItemDark = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: 15,
  background: "rgba(255,255,255,0.04)",
  fontSize: 15,
  fontWeight: 700,
  color: "#e2e8f0",
};

const pillGridLight = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 18,
};

const pillLight = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
};

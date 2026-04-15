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
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          padding: "56px 20px 28px",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Summer–Fall 2026
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 48,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              maxWidth: 760,
            }}
          >
            Why Wollaston Gardens?
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              maxWidth: 760,
              fontSize: 20,
              lineHeight: 1.6,
              color: "#dbeafe",
            }}
          >
            Quincy’s outdoor food and night market is built for visibility,
            energy, and repeat traffic. Vendors get access to a highly
            accessible location, community-driven programming, and a format
            designed to help businesses grow.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a href="/#booking" style={primaryButton}>
              Apply to Book
            </a>
            <a href="/calendar" style={secondaryButton}>
              View Public Calendar
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "28px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={sectionCard}>
            <div style={sectionEyebrow}>The Opportunity</div>
            <h2 style={sectionTitle}>
              A high-visibility outdoor market in a growing Quincy location
            </h2>
            <p style={sectionText}>
              Wollaston Gardens is positioned in the heart of downtown
              Wollaston, steps from the MBTA Red Line and surrounded by growing
              residential density. The concept combines food trucks, community
              gathering, evening entertainment, and consistent seasonal
              programming to create an experience that stands out in Quincy.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 28px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {benefits.map((item) => (
            <div key={item.title} style={benefitCard}>
              <div style={benefitTitle}>{item.title}</div>
              <div style={benefitText}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 20px 28px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 18,
          }}
        >
          <div style={sectionCard}>
            <div style={sectionEyebrow}>Operating Hours</div>
            <h2 style={sectionTitle}>Evening and weekend focused schedule</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <div style={infoBox}>
                <div style={infoTitle}>Summer Season</div>
                <div style={infoBody}>May 15 – August 31, 2026</div>
                <div style={infoList}>Thursdays: 4PM – 9PM</div>
                <div style={infoList}>Fridays: 4PM – 10PM</div>
                <div style={infoList}>Saturdays: 12PM – 10PM</div>
                <div style={infoList}>Sundays: 12PM – 7PM</div>
              </div>

              <div style={infoBox}>
                <div style={infoTitle}>Fall Season</div>
                <div style={infoBody}>September 1 – October 15, 2026</div>
                <div style={infoList}>Thursdays: 4PM – 9PM</div>
                <div style={infoList}>Fridays: 4PM – 10PM</div>
                <div style={infoList}>Saturdays: 12PM – 10PM</div>
                <div style={infoList}>Sundays: 12PM – 7PM</div>
              </div>
            </div>
          </div>

          <div style={sectionCard}>
            <div style={sectionEyebrow}>Event Programming</div>
            <h2 style={sectionTitle}>Reasons customers keep coming back</h2>
            <div style={pillGrid}>
              {programming.map((item) => (
                <div key={item} style={pill}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 28px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <div style={sectionCard}>
            <div style={sectionEyebrow}>Vendor Mix Strategy</div>
            <h2 style={sectionTitle}>
              A curated mix creates better traffic and stronger sales
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mix.map((item) => (
                <div key={item} style={listRow}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={sectionCard}>
            <div style={sectionEyebrow}>Vendor Requirements</div>
            <h2 style={sectionTitle}>What vendors need to participate</h2>
            <div style={pillGrid}>
              {requirements.map((item) => (
                <div key={item} style={pill}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={sectionCard}>
            <div style={sectionEyebrow}>Vendor Commitment</div>
            <h2 style={sectionTitle}>
              Structured, but flexible enough to grow with your business
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <div style={infoBox}>
                <div style={infoTitle}>Season Commitment</div>
                <div style={infoBody}>
                  Full season runs May through October 2026. Vendors are
                  expected to participate consistently, with preferred dates
                  selected in advance.
                </div>
              </div>

              <div style={infoBox}>
                <div style={infoTitle}>Scheduling Flexibility</div>
                <div style={infoBody}>
                  Flexible scheduling supports advance planning and helps
                  vendors choose dates that fit their operating needs.
                </div>
              </div>

              <div style={infoBox}>
                <div style={infoTitle}>Partnership Terms</div>
                <div style={infoBody}>
                  Flat-rate event fees plus a percentage of sales. Priority can
                  be given to vendors who commit consistently and perform well.
                </div>
              </div>

              <div style={infoBox}>
                <div style={infoTitle}>What We Provide</div>
                <div style={infoBody}>
                  Prime location, marketing support, event promotion, crowd
                  energy, and a memorable community-driven setting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              ...sectionCard,
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#ffffff",
            }}
          >
            <div style={{ ...sectionEyebrow, color: "#cbd5e1" }}>
              Join the 2026 Season
            </div>
            <h2 style={{ ...sectionTitle, color: "#ffffff" }}>
              Ready to bring your truck to Wollaston Gardens?
            </h2>
            <p style={{ ...sectionText, color: "#dbeafe", maxWidth: 760 }}>
              If you’re looking for a professionally marketed venue, a strong
              community atmosphere, and a new audience in Quincy, this is your
              chance to apply.
            </p>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <a href="/#booking" style={primaryButton}>
                Apply Now
              </a>
              <a href="/calendar" style={secondaryButtonLight}>
                View Calendar
              </a>
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 15,
                color: "#cbd5e1",
                lineHeight: 1.8,
              }}
            >
              info@thewollastongardens.com
              <br />
              (617) 903-0736
              <br />
              18 Beale St, Quincy, MA 02170
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
  padding: "14px 18px",
  borderRadius: 14,
  background: "#2563eb",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
};

const secondaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 18px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.12)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  border: "1px solid rgba(255,255,255,0.14)",
};

const secondaryButtonLight = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 18px",
  borderRadius: 14,
  background: "transparent",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 15,
  border: "1px solid rgba(255,255,255,0.18)",
};

const sectionCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
};

const sectionEyebrow = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: ".05em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: 10,
};

const sectionTitle = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.15,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "#0f172a",
};

const sectionText = {
  marginTop: 14,
  fontSize: 17,
  lineHeight: 1.7,
  color: "#475569",
};

const benefitCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
};

const benefitTitle = {
  fontSize: 21,
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: 10,
};

const benefitText = {
  fontSize: 16,
  lineHeight: 1.7,
  color: "#475569",
};

const infoBox = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  background: "#fcfdff",
};

const infoTitle = {
  fontSize: 18,
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: 8,
};

const infoBody = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
};

const infoList = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
};

const pillGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const pill = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: 14,
  fontWeight: 700,
  color: "#334155",
};

const listRow = {
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  background: "#f8fafc",
  fontSize: 15,
  fontWeight: 700,
  color: "#334155",
};

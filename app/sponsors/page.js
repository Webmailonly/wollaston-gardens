"use client";

import { useMemo, useState } from "react";

const MONTH_OPTIONS = [
  { value: "2026-05", label: "May 2026" },
  { value: "2026-06", label: "June 2026" },
  { value: "2026-07", label: "July 2026" },
  { value: "2026-08", label: "August 2026" },
  { value: "2026-09", label: "September 2026" },
  { value: "2026-10", label: "October 2026" },
];

const WEEKEND_OPTIONS = [
  { start: "2026-05-21", end: "2026-05-24", label: "May 21–24, 2026" },
  { start: "2026-05-28", end: "2026-05-31", label: "May 28–31, 2026" },
  { start: "2026-06-04", end: "2026-06-07", label: "June 4–7, 2026" },
  { start: "2026-06-11", end: "2026-06-14", label: "June 11–14, 2026" },
  { start: "2026-06-18", end: "2026-06-21", label: "June 18–21, 2026" },
  { start: "2026-06-25", end: "2026-06-28", label: "June 25–28, 2026" },
  { start: "2026-07-02", end: "2026-07-05", label: "July 2–5, 2026" },
  { start: "2026-07-09", end: "2026-07-12", label: "July 9–12, 2026" },
  { start: "2026-07-16", end: "2026-07-19", label: "July 16–19, 2026" },
  { start: "2026-07-23", end: "2026-07-26", label: "July 23–26, 2026" },
  { start: "2026-07-30", end: "2026-08-02", label: "July 30–August 2, 2026" },
  { start: "2026-08-06", end: "2026-08-09", label: "August 6–9, 2026" },
  { start: "2026-08-13", end: "2026-08-16", label: "August 13–16, 2026" },
  { start: "2026-08-20", end: "2026-08-23", label: "August 20–23, 2026" },
  { start: "2026-08-27", end: "2026-08-30", label: "August 27–30, 2026" },
  { start: "2026-09-03", end: "2026-09-06", label: "September 3–6, 2026" },
  { start: "2026-09-10", end: "2026-09-13", label: "September 10–13, 2026" },
  { start: "2026-09-17", end: "2026-09-20", label: "September 17–20, 2026" },
  { start: "2026-09-24", end: "2026-09-27", label: "September 24–27, 2026" },
  { start: "2026-10-01", end: "2026-10-04", label: "October 1–4, 2026" },
  { start: "2026-10-08", end: "2026-10-11", label: "October 8–11, 2026" },
  { start: "2026-10-15", end: "2026-10-18", label: "October 15–18, 2026" },
];

const TIERS = [
  {
    id: "season",
    title: "Tier 1 – Season Sponsor",
    priceLabel: "$3,500+",
    amountCents: 350000,
    bullets: [
      "Logo on calendar page",
      "Featured placement on fence wrap",
      "Mention on all marketing and social media thank you",
      "Beer coasters for three weekends",
      "Included in launch digital and print advertising",
    ],
  },
  {
    id: "monthly",
    title: "Tier 2 – Monthly Sponsor",
    priceLabel: "$1,000",
    amountCents: 100000,
    bullets: [
      "All month long",
      "A-frame at entrance",
      "Calendar placement plus social media thank you",
      "Beer coasters for one weekend",
    ],
  },
  {
    id: "weekend",
    title: "Tier 3 – Single Weekend Sponsor",
    priceLabel: "$500",
    amountCents: 50000,
    bullets: [
      "4 days",
      "A-frame at entrance",
      "Calendar plus social media thank you",
    ],
  },
];

export default function SponsorsPage() {
  const [selectedTier, setSelectedTier] = useState("weekend");
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [selectedWeekend, setSelectedWeekend] = useState(WEEKEND_OPTIONS[0].start);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const weekendRecord = useMemo(
    () => WEEKEND_OPTIONS.find((item) => item.start === selectedWeekend),
    [selectedWeekend]
  );

  const tier = useMemo(
    () => TIERS.find((item) => item.id === selectedTier),
    [selectedTier]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/.netlify/functions/create-sponsor-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tierId: selectedTier,
          companyName,
          contactName,
          email,
          phone,
          website,
          notes,
          month: selectedTier === "monthly" ? selectedMonth : "",
          weekendStart: selectedTier === "weekend" ? weekendRecord?.start || "" : "",
          weekendEnd: selectedTier === "weekend" ? weekendRecord?.end || "" : "",
          weekendLabel: selectedTier === "weekend" ? weekendRecord?.label || "" : "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create sponsor checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error.message || "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "32px 20px",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 42,
              lineHeight: 1.08,
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Sponsorship Opportunities
          </h1>
          <p
            style={{
              margin: "12px auto 0",
              maxWidth: 760,
              fontSize: 18,
              color: "#475569",
            }}
          >
            Sponsor the Wollaston Gardens Food Truck Series and get featured
            directly on our public calendar and on-site event presence.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {TIERS.map((item) => {
              const active = selectedTier === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTier(item.id)}
                  style={{
                    textAlign: "left",
                    background: "#ffffff",
                    border: active ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    borderRadius: 24,
                    padding: 22,
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "start",
                      flexWrap: "wrap",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#2563eb",
                      }}
                    >
                      {item.priceLabel}
                    </div>
                  </div>

                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: "#475569",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              padding: 22,
              boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              position: "sticky",
              top: 20,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              Sponsor Request
            </div>

            <div
              style={{
                fontSize: 15,
                color: "#64748b",
                marginBottom: 18,
              }}
            >
              Choose a sponsorship tier, complete checkout, and your sponsorship
              will populate automatically after payment confirmation.
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Contact Name *</label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Website</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={inputStyle}
                  placeholder="https://"
                />
              </div>

              {selectedTier === "monthly" ? (
                <div>
                  <label style={labelStyle}>Sponsor Month *</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={inputStyle}
                  >
                    {MONTH_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {selectedTier === "weekend" ? (
                <div>
                  <label style={labelStyle}>Sponsor Weekend *</label>
                  <select
                    value={selectedWeekend}
                    onChange={(e) => setSelectedWeekend(e.target.value)}
                    style={inputStyle}
                  >
                    {WEEKEND_OPTIONS.map((item) => (
                      <option key={item.start} value={item.start}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                <strong style={{ color: "#0f172a" }}>Selected Plan:</strong>{" "}
                {tier?.title} — {tier?.priceLabel}
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  border: 0,
                  borderRadius: 16,
                  padding: "15px 18px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Redirecting…" : "Continue to Payment"}
              </button>

              {message ? (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca",
                    fontSize: 14,
                  }}
                >
                  {message}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 8,
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  fontSize: 16,
  background: "#fff",
  outline: "none",
};

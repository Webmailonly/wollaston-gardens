"use client";

import { useEffect, useMemo, useState } from "react";

async function loadBookings() {
  try {
    const response = await fetch("/.netlify/functions/bookings-get");
    const data = await response.json();
    return data?.slots ? data.slots : [];
  } catch {
    return [];
  }
}

async function loadSponsors() {
  try {
    const response = await fetch("/.netlify/functions/sponsors-get");
    const data = await response.json();
    return data?.sponsors || [];
  } catch {
    return [];
  }
}

function getSponsorsForDate(date, sponsors) {
  const month = date.slice(0, 7);

  return sponsors.filter((sponsor) => {
    if (sponsor.status !== "paid") return false;

    if (sponsor.tierId === "season") return true;
    if (sponsor.tierId === "monthly" && sponsor.month === month) return true;
    if (
      sponsor.tierId === "weekend" &&
      sponsor.weekendStart &&
      sponsor.weekendEnd &&
      date >= sponsor.weekendStart &&
      date <= sponsor.weekendEnd
    ) {
      return true;
    }

    return false;
  });
}

export default function CalendarPage() {
  const [slots, setSlots] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [calendarSearch, setCalendarSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [loadedSlots, loadedSponsors] = await Promise.all([
        loadBookings(),
        loadSponsors(),
      ]);
      setSlots(loadedSlots);
      setSponsors(loadedSponsors);
    })();
  }, []);

  const approvedSlots = useMemo(() => {
    return slots
      .filter((slot) => slot.status === "approved")
      .sort((a, b) =>
        `${a.date}${a.startTime}${a.location}`.localeCompare(
          `${b.date}${b.startTime}${b.location}`
        )
      );
  }, [slots]);

  const groupedSchedule = useMemo(() => {
    const q = calendarSearch.toLowerCase().trim();

    const filtered = approvedSlots.filter((slot) => {
      return (
        !q ||
        String(slot.truck || "").toLowerCase().includes(q) ||
        String(slot.displayDate || "").toLowerCase().includes(q) ||
        String(slot.cuisine || "").toLowerCase().includes(q) ||
        String(slot.slotLabel || "").toLowerCase().includes(q) ||
        String(slot.location || "").toLowerCase().includes(q)
      );
    });

    const groups = [];

    for (const slot of filtered) {
      const existing = groups.find((group) => group.date === slot.date);
      if (existing) {
        existing.items.push(slot);
      } else {
        groups.push({
          date: slot.date,
          displayDate: slot.displayDate,
          items: [slot],
        });
      }
    }

    return groups;
  }, [approvedSlots, calendarSearch]);

  const visibleSponsors = useMemo(() => {
    if (!groupedSchedule.length) return [];

    const sponsorMap = new Map();

    for (const group of groupedSchedule) {
      const dateSponsors = getSponsorsForDate(group.date, sponsors);
      for (const sponsor of dateSponsors) {
        sponsorMap.set(sponsor.id, sponsor);
      }
    }

    return Array.from(sponsorMap.values());
  }, [groupedSchedule, sponsors]);

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
              fontSize: 40,
              lineHeight: 1.1,
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Food Truck Schedule
          </h1>
          <p
            style={{
              margin: "12px auto 0",
              maxWidth: 720,
              fontSize: 18,
              color: "#475569",
            }}
          >
            See upcoming vendors at Wollaston Gardens.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            padding: 22,
            marginBottom: 24,
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 8,
              color: "#334155",
            }}
          >
            Search schedule
          </label>
          <input
            value={calendarSearch}
            onChange={(e) => setCalendarSearch(e.target.value)}
            placeholder="Search by vendor, cuisine, date, shift, or location"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              fontSize: 16,
              outline: "none",
            }}
          />
        </div>

        {visibleSponsors.length > 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e9d5ff",
              borderRadius: 24,
              padding: 22,
              marginBottom: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 14,
                color: "#6d28d9",
              }}
            >
              Sponsors
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {visibleSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  style={{
                    border: "1px solid #ede9fe",
                    borderRadius: 18,
                    padding: 16,
                    background: "#faf5ff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {sponsor.companyName}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 14,
                      color: "#64748b",
                    }}
                  >
                    {sponsor.tierLabel}
                    {sponsor.tierId === "monthly" && sponsor.month
                      ? ` • ${sponsor.month}`
                      : ""}
                    {sponsor.tierId === "weekend" && sponsor.weekendLabel
                      ? ` • ${sponsor.weekendLabel}`
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {groupedSchedule.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              padding: 28,
              boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No approved vendors match your search yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {groupedSchedule.map((group) => {
              const dateSponsors = getSponsorsForDate(group.date, sponsors);

              return (
                <section
                  key={group.date}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                      marginBottom: 16,
                      paddingBottom: 14,
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {group.displayDate}
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      {group.items.length} vendor{group.items.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  {dateSponsors.length > 0 ? (
                    <div
                      style={{
                        marginBottom: 16,
                        border: "1px solid #ede9fe",
                        borderRadius: 18,
                        padding: 16,
                        background: "#faf5ff",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#6d28d9",
                          marginBottom: 8,
                        }}
                      >
                        Sponsored By
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {dateSponsors.map((sponsor) => (
                          <div key={sponsor.id}>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: "#0f172a",
                              }}
                            >
                              {sponsor.companyName}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#64748b",
                                marginTop: 2,
                              }}
                            >
                              {sponsor.tierLabel}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {group.items.map((event) => (
                      <div
                        key={event.id}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 18,
                          padding: 18,
                          background: "#fcfdff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 18,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>
                            {event.truck}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            <span
                              style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                fontSize: 14,
                                color: "#475569",
                              }}
                            >
                              {event.cuisine}
                            </span>
                            <span
                              style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                fontSize: 14,
                                color: "#475569",
                              }}
                            >
                              {event.slotLabel}
                            </span>
                            <span
                              style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                fontSize: 14,
                                color: "#475569",
                              }}
                            >
                              {event.location}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.displayTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

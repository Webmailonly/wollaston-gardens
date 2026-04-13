"use client";

import { useEffect, useMemo, useState } from "react";

const SCHEDULE_ROWS = [
  ["2026-05-15", "Friday"],
  ["2026-05-16", "Saturday"],
  ["2026-05-17", "Sunday"],
  ["2026-05-21", "Thursday"],
  ["2026-05-22", "Friday"],
  ["2026-05-23", "Saturday"],
  ["2026-05-24", "Sunday"],
  ["2026-05-28", "Thursday"],
  ["2026-05-29", "Friday"],
  ["2026-05-30", "Saturday"],
  ["2026-05-31", "Sunday"],
  ["2026-06-04", "Thursday"],
  ["2026-06-05", "Friday"],
  ["2026-06-06", "Saturday"],
  ["2026-06-07", "Sunday"],
  ["2026-06-11", "Thursday"],
  ["2026-06-12", "Friday"],
  ["2026-06-13", "Saturday"],
  ["2026-06-14", "Sunday"],
  ["2026-06-18", "Thursday"],
  ["2026-06-19", "Friday"],
  ["2026-06-20", "Saturday"],
  ["2026-06-21", "Sunday"],
  ["2026-06-25", "Thursday"],
  ["2026-06-26", "Friday"],
  ["2026-06-27", "Saturday"],
  ["2026-06-28", "Sunday"],
  ["2026-07-02", "Thursday"],
  ["2026-07-03", "Friday"],
  ["2026-07-04", "Saturday"],
  ["2026-07-05", "Sunday"],
  ["2026-07-09", "Thursday"],
  ["2026-07-10", "Friday"],
  ["2026-07-11", "Saturday"],
  ["2026-07-12", "Sunday"],
  ["2026-07-16", "Thursday"],
  ["2026-07-17", "Friday"],
  ["2026-07-18", "Saturday"],
  ["2026-07-19", "Sunday"],
  ["2026-07-23", "Thursday"],
  ["2026-07-24", "Friday"],
  ["2026-07-25", "Saturday"],
  ["2026-07-26", "Sunday"],
  ["2026-07-30", "Thursday"],
  ["2026-07-31", "Friday"],
  ["2026-08-01", "Saturday"],
  ["2026-08-02", "Sunday"],
  ["2026-08-06", "Thursday"],
  ["2026-08-07", "Friday"],
  ["2026-08-08", "Saturday"],
  ["2026-08-09", "Sunday"],
  ["2026-08-13", "Thursday"],
  ["2026-08-14", "Friday"],
  ["2026-08-15", "Saturday"],
  ["2026-08-16", "Sunday"],
  ["2026-08-20", "Thursday"],
  ["2026-08-21", "Friday"],
  ["2026-08-22", "Saturday"],
  ["2026-08-23", "Sunday"],
  ["2026-08-27", "Thursday"],
  ["2026-08-28", "Friday"],
  ["2026-08-29", "Saturday"],
  ["2026-08-30", "Sunday"],
  ["2026-09-03", "Thursday"],
  ["2026-09-04", "Friday"],
  ["2026-09-05", "Saturday"],
  ["2026-09-06", "Sunday"],
  ["2026-09-10", "Thursday"],
  ["2026-09-11", "Friday"],
  ["2026-09-12", "Saturday"],
  ["2026-09-13", "Sunday"],
  ["2026-09-17", "Thursday"],
  ["2026-09-18", "Friday"],
  ["2026-09-19", "Saturday"],
  ["2026-09-20", "Sunday"],
  ["2026-09-24", "Thursday"],
  ["2026-09-25", "Friday"],
  ["2026-09-26", "Saturday"],
  ["2026-09-27", "Sunday"],
  ["2026-10-01", "Thursday"],
  ["2026-10-02", "Friday"],
  ["2026-10-03", "Saturday"],
  ["2026-10-04", "Sunday"],
  ["2026-10-08", "Thursday"],
  ["2026-10-09", "Friday"],
  ["2026-10-10", "Saturday"],
  ["2026-10-11", "Sunday"],
  ["2026-10-15", "Thursday"],
  ["2026-10-16", "Friday"],
  ["2026-10-17", "Saturday"],
];

function getMonthName(monthIndex) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthIndex];
}

async function loadState() {
  try {
    const response = await fetch("/.netlify/functions/bookings-get");
    const data = await response.json();
    return data?.slots ? { slots: data.slots } : null;
  } catch {
    return null;
  }
}

export default function CalendarPage() {
  const [slots, setSlots] = useState([]);
  const [calendarSearch, setCalendarSearch] = useState("");

  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved?.slots) {
        setSlots(saved.slots);
      }
    })();
  }, []);

  const approvedSlots = useMemo(() => {
    return slots.filter((slot) => slot.status === "approved");
  }, [slots]);

  const groupedCalendar = useMemo(() => {
    const q = calendarSearch.toLowerCase().trim();

    const approvedByDate = new Map();

    for (const slot of approvedSlots) {
      const matches =
        !q ||
        String(slot.truck || "").toLowerCase().includes(q) ||
        String(slot.displayDate || "").toLowerCase().includes(q) ||
        String(slot.cuisine || "").toLowerCase().includes(q) ||
        String(slot.slotLabel || "").toLowerCase().includes(q) ||
        String(slot.location || "").toLowerCase().includes(q);

      if (!matches) continue;

      if (!approvedByDate.has(slot.date)) {
        approvedByDate.set(slot.date, []);
      }

      approvedByDate.get(slot.date).push(slot);
    }

    const uniqueDates = Array.from(new Set(SCHEDULE_ROWS.map(([date]) => date))).sort();

    return uniqueDates
      .map((date) => {
        const [year, month, day] = date.split("-").map(Number);
        const displayDate = `${getMonthName(month - 1)} ${day}, ${year}`;
        const items = (approvedByDate.get(date) || []).sort((a, b) =>
          `${a.startTime}${a.location}`.localeCompare(`${b.startTime}${b.location}`)
        );

        return {
          date,
          displayDate,
          items,
        };
      })
      .filter((group) => {
        if (!q) return true;
        return (
          group.displayDate.toLowerCase().includes(q) || group.items.length > 0
        );
      });
  }, [approvedSlots, calendarSearch]);

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
            Food Truck Calendar
          </h1>
          <p
            style={{
              margin: "12px auto 0",
              maxWidth: 700,
              fontSize: 18,
              color: "#475569",
            }}
          >
            See upcoming food truck vendors scheduled at Wollaston Gardens.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            padding: 20,
            marginBottom: 24,
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          <label
            htmlFor="calendar-search"
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 8,
              color: "#334155",
            }}
          >
            Search calendar
          </label>
          <input
            id="calendar-search"
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {groupedCalendar.map((group) => (
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
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: "1px solid #e2e8f0",
                  flexWrap: "wrap",
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
                  {group.items.length === 0
                    ? "No vendors scheduled yet"
                    : `${group.items.length} vendor${group.items.length === 1 ? "" : "s"}`}
                </div>
              </div>

              {group.items.length === 0 ? (
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 18,
                    background: "#f8fafc",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Available</div>
                    <div style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                      No approved vendors are listed for this date yet.
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Schedule pending
                  </div>
                </div>
              ) : (
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
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

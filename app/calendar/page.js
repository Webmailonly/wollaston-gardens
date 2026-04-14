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

function buildMonthGrid(dateString) {
  const [year, month] = dateString.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();

  const cells = [];

  for (let i = 0; i < startDay; i++) cells.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(iso);
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

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
  const [month, setMonth] = useState("2026-05");
  const [selectedDate, setSelectedDate] = useState("");

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
    return slots.filter((slot) => slot.status === "approved");
  }, [slots]);

  const monthDates = useMemo(() => buildMonthGrid(month), [month]);

  const searchableApprovedSlots = useMemo(() => {
    const q = calendarSearch.toLowerCase().trim();

    return approvedSlots.filter((slot) => {
      return (
        !q ||
        String(slot.truck || "").toLowerCase().includes(q) ||
        String(slot.displayDate || "").toLowerCase().includes(q) ||
        String(slot.cuisine || "").toLowerCase().includes(q) ||
        String(slot.slotLabel || "").toLowerCase().includes(q) ||
        String(slot.location || "").toLowerCase().includes(q)
      );
    });
  }, [approvedSlots, calendarSearch]);

  const datesWithApprovedBookings = useMemo(() => {
    return new Set(searchableApprovedSlots.map((slot) => slot.date));
  }, [searchableApprovedSlots]);

  const selectedDateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return searchableApprovedSlots
      .filter((slot) => slot.date === selectedDate)
      .sort((a, b) =>
        `${a.startTime}${a.location}`.localeCompare(`${b.startTime}${b.location}`)
      );
  }, [searchableApprovedSlots, selectedDate]);

  const selectedDateDisplay = useMemo(() => {
    if (!selectedDate) return "";
    const [year, monthNum, day] = selectedDate.split("-").map(Number);
    return `${getMonthName(monthNum - 1)} ${day}, ${year}`;
  }, [selectedDate]);

  const selectedDateSponsors = useMemo(() => {
    if (!selectedDate) return [];
    return getSponsorsForDate(selectedDate, sponsors);
  }, [selectedDate, sponsors]);

  return (
    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "32px 20px",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
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
              maxWidth: 720,
              fontSize: 18,
              color: "#475569",
            }}
          >
            View upcoming food truck vendors scheduled at Wollaston Gardens.
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
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div style={{ minWidth: 220 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#334155",
                }}
              >
                Month
              </label>
              <select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setSelectedDate("");
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  fontSize: 16,
                  background: "#fff",
                }}
              >
                <option value="2026-05">May 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <label
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
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#64748b",
                  padding: "8px 4px",
                }}
              >
                {day}
              </div>
            ))}

            {monthDates.map((dateCell, index) => {
              if (!dateCell) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{
                      minHeight: 110,
                      borderRadius: 18,
                      background: "transparent",
                    }}
                  />
                );
              }

              const dayNumber = Number(dateCell.split("-")[2]);
              const [y, m, d] = dateCell.split("-").map(Number);
              const dateObj = new Date(y, m - 1, d);
              const dayOfWeek = dateObj.getDay();
              const isClosedDay =
                dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3;

              const hasApprovedBooking = datesWithApprovedBookings.has(dateCell);
              const isSelected = selectedDate === dateCell;
              const dateSponsors = getSponsorsForDate(dateCell, sponsors);
              const hasSponsor = dateSponsors.length > 0;

              return (
                <button
                  key={dateCell}
                  type="button"
                  onClick={() => !isClosedDay && setSelectedDate(dateCell)}
                  disabled={isClosedDay}
                  style={{
                    minHeight: 130,
                    borderRadius: 18,
                    border: isSelected
                      ? "2px solid #2563eb"
                      : isClosedDay
                      ? "1px solid #fecaca"
                      : hasApprovedBooking || hasSponsor
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",
                    background: isSelected
                      ? "#eff6ff"
                      : isClosedDay
                      ? "#fef2f2"
                      : hasApprovedBooking || hasSponsor
                      ? "#f8fbff"
                      : "#ffffff",
                    padding: 12,
                    textAlign: "left",
                    cursor: isClosedDay ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(15,23,42,0.03)",
                    opacity: isClosedDay ? 0.9 : 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0f172a",
                      marginBottom: 8,
                    }}
                  >
                    {dayNumber}
                  </div>

                  {isClosedDay ? (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#ef4444",
                      }}
                    >
                      Closed
                    </div>
                  ) : hasApprovedBooking ? (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2563eb",
                      }}
                    >
                      Vendors scheduled
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#94a3b8",
                      }}
                    >
                      No vendors yet
                    </div>
                  )}

                  {!isClosedDay && hasSponsor ? (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#7c3aed",
                      }}
                    >
                      Sponsored
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            padding: 22,
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {selectedDate ? selectedDateDisplay : "Choose a Date"}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 15,
                color: "#64748b",
              }}
            >
              {selectedDate
                ? "Approved vendors scheduled for this date."
                : "Click an open date on the calendar to view scheduled vendors."}
            </div>
          </div>

          {!selectedDate ? (
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: 18,
                padding: 24,
                textAlign: "center",
                color: "#64748b",
                background: "#f8fafc",
              }}
            >
              Select an open date above to view the food truck schedule.
            </div>
          ) : (
            <>
              {selectedDateSponsors.length > 0 ? (
                <div
                  style={{
                    marginBottom: 18,
                    border: "1px solid #e9d5ff",
                    borderRadius: 18,
                    padding: 18,
                    background: "#faf5ff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#6d28d9",
                      marginBottom: 10,
                    }}
                  >
                    Sponsors
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedDateSponsors.map((sponsor) => (
                      <div key={sponsor.id}>
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

              {selectedDateSlots.length === 0 ? (
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 20,
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
                  {selectedDateSlots.map((event) => (
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const { getStore } = require("@netlify/blobs");

function esc(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

function buildICS(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wollaston Gardens//Seasonal Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const uid = `booking-${event.id}@wollastongardens.com`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const dtstart = formatDateTime(event.date, event.startTime);
    const dtend = formatDateTime(event.date, event.endTime);

    const summary = `${event.truck || "Food Truck"} - ${event.slotLabel || "Shift"}`;
    const description = [
      `Vendor: ${event.truck || ""}`,
      `Cuisine: ${event.cuisine || ""}`,
      `Location: ${event.location || ""}`,
      `Shift: ${event.displayTime || ""}`,
      `Venue: Wollaston Gardens`,
    ].join("\\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${esc(uid)}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${esc(summary)}`,
      `DESCRIPTION:${esc(description)}`,
      `LOCATION:${esc(`${event.location || ""} - Wollaston Gardens`)}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

exports.handler = async () => {
  try {
    const store = getStore("wollaston-bookings");
    const slots = (await store.get("slots", { type: "json" })) || [];

    const approved = slots.filter((slot) => slot.status === "approved");

    const ics = buildICS(approved);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="wollaston-gardens-seasonal-calendar.ics"',
        "Cache-Control": "no-store",
      },
      body: ics,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `ICS export failed: ${error.message}`,
    };
  }
};

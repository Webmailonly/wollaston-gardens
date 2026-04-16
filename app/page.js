"use client";

import { useEffect, useMemo, useState } from "react";

const VENUE_NAME = "Wollaston Gardens";
const ADMIN_EMAIL = "info@thewollastongardens.com";
const ADMIN_PHONE = "617 903 0736";
const DEPOSIT_METHOD = "Stripe";

const LOCATIONS = [
  "Location 1",
  "Location 2",
  "Location 3",
  "Location 4",
];

const CUISINE_OPTIONS = [
  "American",
  "Brazilian",
  "Chinese",
  "Asian Fusion",
  "Indian",
  "Middle Eastern",
  "Irish",
  "German",
  "French",
  "Greek",
  "Italian",
  "Mexican",
  "Jamaican",
  "Caribbean",
  "BBQ",
  "Pizza",
  "Pasta",
  "Sushi",
  "Dessert",
  "Pastry",
];

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

const emptyForm = {
  truck: "",
  contactName: "",
  email: "",
  phone: "",
  cuisine: "",
  location: "",
  requirements: "",
  slotId: "",
  acceptedContract: false,
  insuranceAcknowledged: false,
};

async function saveState(state) {
  try {
    await fetch("/.netlify/functions/bookings-save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
  } catch (error) {
    console.error("Save failed", error);
  }
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

function getSeasonWindow(date) {
  if (date >= "2026-05-15" && date <= "2026-06-30") return "may-june";
  if (date >= "2026-07-01" && date < "2026-08-15") return "july-aug14";
  return "aug15-oct15";
}

function getPricing(slot) {
  if (slot.date === "2026-10-03" || slot.date === "2026-10-04") {
    return "$250 + 10% of sales";
  }

  const season = getSeasonWindow(slot.date);

  if (slot.slotKind === "full-day") {
    return season === "july-aug14"
      ? "$175 + 10% of sales"
      : "$225 + 10% of sales";
  }

  if (slot.durationHours === 3) {
    return season === "july-aug14"
      ? "$125 + 12% of sales"
      : "$150 + 10% of sales";
  }

  if (slot.durationHours === 4 || slot.durationHours === 5) {
    return season === "july-aug14"
      ? "$125 + 10% of sales"
      : "$175 + 10% of sales";
  }

  return "$150 + 10% of sales";
}

function getDepositText(slot) {
  return `50% deposit due after approval via ${DEPOSIT_METHOD}. Rate: ${getPricing(slot)}`;
}

function getDepositAmountCents(slot) {
  const price = getPricing(slot);
  const match = price.match(/\$(\d+)/);
  if (!match) return 10000;
  const fullAmount = Number(match[1]);
  return Math.round(fullAmount * 100 * 0.5);
}

function createSlotsFromSchedule() {
  let id = 1;
  const slots = [];

  for (const [date, day] of SCHEDULE_ROWS) {
    const [year, month, dayNumber] = date.split("-").map(Number);
    const displayDate = `${getMonthName(month - 1)} ${dayNumber}, ${year}`;

    for (const locationName of LOCATIONS) {
      const base = {
        date,
        displayDate,
        day,
        location: locationName,
        status: "open",
        venueArea: `${VENUE_NAME} - ${locationName}`,
        truck: null,
        cuisine: null,
        contactName: null,
        email: null,
        phone: null,
        requirements: null,
        depositRequested: false,
        depositReceived: false,
        insuranceReceived: false,
        cancelReason: "",
        adminNotes: "",
        notificationState: "not-sent",
      };

      const pushSlot = (extra) => {
        slots.push({
          ...base,
          id: id++,
          ...extra,
        });
      };

      if (day === "Thursday" || day === "Friday") {
        pushSlot({
          startTime: "16:00",
          endTime: "21:00",
          displayTime: "4:00 PM - 9:00 PM",
          category: "Dinner",
          slotKind: "standard",
          slotLabel: "Dinner Shift",
          durationHours: 5,
        });
        continue;
      }

      if (day === "Saturday") {
        pushSlot({
          startTime: "12:00",
          endTime: "15:00",
          displayTime: "12:00 PM - 3:00 PM",
          category: "Lunch",
          slotKind: "partial",
          slotLabel: "Lunch Shift",
          durationHours: 3,
        });

        pushSlot({
          startTime: "16:00",
          endTime: "21:00",
          displayTime: "4:00 PM - 9:00 PM",
          category: "Dinner",
          slotKind: "partial",
          slotLabel: "Dinner Shift",
          durationHours: 5,
        });

        pushSlot({
          startTime: "12:00",
          endTime: "21:00",
          displayTime: "12:00 PM - 9:00 PM",
          category: "Full Day",
          slotKind: "full-day",
          slotLabel: "Full Day",
          durationHours: 9,
          priorityTier: "priority",
        });

        continue;
      }

      if (day === "Sunday") {
        pushSlot({
          startTime: "12:00",
          endTime: "15:00",
          displayTime: "12:00 PM - 3:00 PM",
          category: "Lunch",
          slotKind: "partial",
          slotLabel: "Midday Shift",
          durationHours: 3,
        });

        pushSlot({
          startTime: "16:00",
          endTime: "19:00",
          displayTime: "4:00 PM - 7:00 PM",
          category: "Dinner",
          slotKind: "partial",
          slotLabel: "Evening Shift",
          durationHours: 3,
        });

        pushSlot({
          startTime: "12:00",
          endTime: "19:00",
          displayTime: "12:00 PM - 7:00 PM",
          category: "Full Day",
          slotKind: "full-day",
          slotLabel: "Full Day",
          durationHours: 7,
          priorityTier: "priority",
        });
      }
    }
  }

  return slots;
}

function getRelatedSlotIds(slot, allSlots) {
  if (!slot || !["Saturday", "Sunday"].includes(slot.day)) {
    return slot ? [slot.id] : [];
  }

  return allSlots
    .filter(
      (candidate) =>
        candidate.date === slot.date &&
        candidate.location === slot.location
    )
    .map((candidate) => candidate.id);
}

function isSlotBlockedByDateConflict(slot, allSlots) {
  const relatedIds = getRelatedSlotIds(slot, allSlots);

  return allSlots.some(
    (candidate) =>
      relatedIds.includes(candidate.id) &&
      candidate.id !== slot.id &&
      ["pending", "approved"].includes(candidate.status)
  );
}

function escapeICS(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatICSDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

function buildICSFromApprovedSlots(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
"PRODID:-//Wollaston Gardens//Seasonal Calendar//EN",
"CALSCALE:GREGORIAN",
"METHOD:PUBLISH",
...events,
"END:VCALENDAR",
];

return icsLines.join("\r\n");
}

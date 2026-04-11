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
        insuranceUploaded: false,
        insuranceFileName: "",
        insuranceUploadedAt: "",
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
  ];

  for (const event of events) {
    const uid = `booking-${event.id}@wollastongardens.com`;
    const dtstamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

    const dtstart = formatICSDateTime(event.date, event.startTime);
    const dtend = formatICSDateTime(event.date, event.endTime);

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
      `UID:${escapeICS(uid)}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${escapeICS(summary)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      `LOCATION:${escapeICS(`${event.location || ""} - Wollaston Gardens`)}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(events) {
  const ics = buildICSFromApprovedSlots(events);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wollaston-gardens-seasonal-calendar.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function buildMonthGrid(dateString) {
  const [year, month] = dateString.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();

  const cells = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(iso);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const initialSlots = createSlotsFromSchedule();

export default function Page() {
  const [slots, setSlots] = useState(initialSlots);
  const [form, setForm] = useState(emptyForm);
  const [calendarSearch, setCalendarSearch] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("vendor");
  const [availabilityMonth, setAvailabilityMonth] = useState("2026-05");
  const [selectedDate, setSelectedDate] = useState("");

  const [insuranceBookingId, setInsuranceBookingId] = useState("");
  const [insuranceEmail, setInsuranceEmail] = useState("");
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [insuranceMessage, setInsuranceMessage] = useState("");

  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved?.slots) setSlots(saved.slots);
    })();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("wg_admin_auth");
    if (stored === "true") {
      setIsAdmin(true);
    }

    const params = new URLSearchParams(window.location.search);
    const insurance = params.get("insurance");
    const bookingId = params.get("bookingId");

    if (insurance === "1" && bookingId) {
      setInsuranceBookingId(bookingId);
      setTimeout(() => {
        document.getElementById("insurance-upload")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, []);

  useEffect(() => {
    saveState({ slots });
  }, [slots]);

  useEffect(() => {
    if (selectedSlotId) {
      setForm((prev) => ({ ...prev, slotId: String(selectedSlotId) }));
    }
  }, [selectedSlotId]);

  const openSlots = useMemo(
    () =>
      slots.filter(
        (slot) =>
          slot.status === "open" && !isSlotBlockedByDateConflict(slot, slots)
      ),
    [slots]
  );

  const locationFilteredOpenSlots = useMemo(() => {
    if (!form.location) return [];
    return openSlots.filter((slot) => slot.location === form.location);
  }, [openSlots, form.location]);

  const pendingSlots = useMemo(
    () => slots.filter((slot) => slot.status === "pending"),
    [slots]
  );

  const approvedSlots = useMemo(
    () => slots.filter((slot) => slot.status === "approved"),
    [slots]
  );

  const publicCalendar = useMemo(() => {
    return approvedSlots
      .filter((slot) => {
        const q = calendarSearch.toLowerCase();
        return (
          !q ||
          String(slot.truck || "").toLowerCase().includes(q) ||
          String(slot.displayDate || "").toLowerCase().includes(q) ||
          String(slot.cuisine || "").toLowerCase().includes(q) ||
          String(slot.slotLabel || "").toLowerCase().includes(q) ||
          String(slot.location || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
      );
  }, [approvedSlots, calendarSearch]);

  const availabilityMonthDates = useMemo(() => {
    return buildMonthGrid(availabilityMonth);
  }, [availabilityMonth]);

  const datesWithAvailability = useMemo(() => {
    return new Set(openSlots.map((slot) => slot.date));
  }, [openSlots]);

  const selectedDateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return openSlots
      .filter((slot) => slot.date === selectedDate)
      .sort((a, b) => {
        const first = `${a.startTime}${a.location}`;
        const second = `${b.startTime}${b.location}`;
        return first.localeCompare(second);
      });
  }, [openSlots, selectedDate]);

  const selectedDateGroupedBySlot = useMemo(() => {
    const groups = {};
    for (const slot of selectedDateSlots) {
      const key = `${slot.startTime}-${slot.endTime}-${slot.slotLabel}`;
      if (!groups[key]) {
        groups[key] = {
          slotLabel: slot.slotLabel,
          displayTime: slot.displayTime,
          slotKind: slot.slotKind,
          durationHours: slot.durationHours,
          locations: [],
        };
      }
      groups[key].locations.push(slot);
    }
    return Object.values(groups);
  }, [selectedDateSlots]);

  function updateForm(field, value) {
    setForm((prev) => {
      if (field === "location") {
        return {
          ...prev,
          location: value,
          slotId: "",
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function selectAvailabilitySlot(slot) {
    setSelectedSlotId(String(slot.id));
    setForm((prev) => ({
      ...prev,
      location: slot.location,
      slotId: String(slot.id),
    }));
    setActiveTab("vendor");
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitBooking(e) {
    e.preventDefault();

    const selectedSlot = slots.find(
      (slot) => String(slot.id) === String(form.slotId)
    );

    if (
      !selectedSlot ||
      !form.truck ||
      !form.contactName ||
      !form.email ||
      !form.cuisine ||
      !form.location
    ) {
      setMessage(
        "Please complete all required fields and choose a location and available slot."
      );
      return;
    }

    if (!form.acceptedContract) {
      setMessage("Please review and accept the contract terms before submitting.");
      return;
    }

    if (!form.insuranceAcknowledged) {
      setMessage(
        "Please acknowledge the insurance requirement before submitting."
      );
      return;
    }

    if (isSlotBlockedByDateConflict(selectedSlot, slots)) {
      setMessage(
        "That slot is no longer available because a conflicting split or full-day request already exists."
      );
      return;
    }

    const updatedSlots = slots.map((slot) => {
      if (String(slot.id) !== String(form.slotId)) return slot;
      return {
        ...slot,
        status: "pending",
        truck: form.truck,
        cuisine: form.cuisine,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        requirements: form.requirements,
        notificationState: "queued",
      };
    });

    setSlots(updatedSlots);

    try {
      const response = await fetch("/.netlify/functions/send-booking-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          truck: form.truck,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          cuisine: form.cuisine,
          requirements: form.requirements,
          slotLabel: selectedSlot.slotLabel,
          displayDate: selectedSlot.displayDate,
          displayTime: selectedSlot.displayTime,
          location: selectedSlot.location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Email sending failed");
      }

      setMessage(
        `Booking request submitted. Email notifications sent to ${ADMIN_EMAIL} and ${form.email}.`
      );
    } catch {
      setMessage("Booking request saved, but email sending failed.");
    }

    setForm(emptyForm);
    setSelectedSlotId("");
  }

  async function approveSlot(slotId) {
    const selected = slots.find((slot) => slot.id === slotId);
    if (!selected) return;

    const relatedIds = getRelatedSlotIds(selected, slots);

    const updatedSlots = slots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: "approved",
          notificationState: "sent",
          depositRequested: true,
        };
      }

      if (
        relatedIds.includes(slot.id) &&
        slot.id !== slotId &&
        slot.status === "pending" &&
        selected.slotKind === "full-day"
      ) {
        return {
          ...slot,
          status: "declined",
          adminNotes: "Declined due to approved full-day priority booking.",
        };
      }

      return slot;
    });

    setSlots(updatedSlots);

    const approvedSlot = updatedSlots.find((slot) => slot.id === slotId);

    try {
      const checkoutResponse = await fetch(
        "/.netlify/functions/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: approvedSlot.id,
            vendorEmail: approvedSlot.email,
            truck: approvedSlot.truck,
            displayDate: approvedSlot.displayDate,
            displayTime: approvedSlot.displayTime,
            amountCents: getDepositAmountCents(approvedSlot),
          }),
        }
      );

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        throw new Error(
          checkoutData.error || "Failed to create Stripe checkout session"
        );
      }

      const emailResponse = await fetch(
        "/.netlify/functions/send-approval-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: approvedSlot.id,
            truck: approvedSlot.truck,
            contactName: approvedSlot.contactName,
            email: approvedSlot.email,
            cuisine: approvedSlot.cuisine,
            slotLabel: approvedSlot.slotLabel,
            displayDate: approvedSlot.displayDate,
            displayTime: approvedSlot.displayTime,
            location: approvedSlot.location,
            depositText: getDepositText(approvedSlot),
            paymentLink: checkoutData.url,
          }),
        }
      );

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(emailData.error || "Approval email failed");
      }

      setMessage(
        `Booking approved. Approval email, Stripe deposit request, and insurance upload link were sent to ${approvedSlot.email}.`
      );
    } catch (error) {
      setMessage(`Booking approved, but follow-up failed: ${error.message}`);
    }
  }

  function declineSlot(slotId) {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;

        return {
          ...slot,
          status: "open",
          truck: null,
          cuisine: null,
          contactName: null,
          email: null,
          phone: null,
          requirements: null,
          depositRequested: false,
          depositReceived: false,
          insuranceReceived: false,
          insuranceUploaded: false,
          insuranceFileName: "",
          insuranceUploadedAt: "",
          cancelReason: "",
          adminNotes: "",
          notificationState: "not-sent",
        };
      })
    );

    setMessage("Booking request declined and slot reopened.");
  }

  function cancelReservation(slotId) {
    const reason =
      window.prompt("Enter cancellation reason:", "Cancelled by admin") ||
      "Cancelled by admin";

    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;

        return {
          ...slot,
          status: "open",
          truck: null,
          cuisine: null,
          contactName: null,
          email: null,
          phone: null,
          requirements: null,
          depositRequested: false,
          depositReceived: false,
          insuranceReceived: false,
          insuranceUploaded: false,
          insuranceFileName: "",
          insuranceUploadedAt: "",
          cancelReason: reason,
          adminNotes: reason,
          notificationState: "not-sent",
        };
      })
    );

    setMessage(
      `Reservation cancelled by admin and removed from the Seasonal Calendar. Reason: ${reason}`
    );
  }

  function toggleApprovedFlag(slotId, field) {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id !== slotId ? slot : { ...slot, [field]: !slot[field] }
      )
    );
  }

  async function handleInsuranceUpload(e) {
    e.preventDefault();
    setInsuranceMessage("");

    if (!insuranceBookingId || !insuranceEmail || !insuranceFile) {
      setInsuranceMessage("Please provide booking ID, email, and insurance file.");
      return;
    }

    try {
      const base64 = await fileToBase64(insuranceFile);

      const response = await fetch("/.netlify/functions/insurance-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: insuranceBookingId,
          email: insuranceEmail,
          fileName: insuranceFile.name,
          fileType: insuranceFile.type || "application/octet-stream",
          fileDataBase64: base64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Insurance upload failed");
      }

      const refreshed = await loadState();
      if (refreshed?.slots) {
        setSlots(refreshed.slots);
      }

      setInsuranceMessage("Insurance uploaded successfully. Admin can now review it.");
      setInsuranceFile(null);
    } catch (error) {
      setInsuranceMessage(error.message || "Insurance upload failed");
    }
  }

  async function handleAdminLogin() {
    setLoginError("");

    try {
      const res = await fetch("/.netlify/functions/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAdmin(true);
        window.localStorage.setItem("wg_admin_auth", "true");
        return;
      }

      setLoginError("Invalid credentials");
    } catch {
      setLoginError("Login failed");
    }
  }

  function handleLogout() {
    setIsAdmin(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    window.localStorage.removeItem("wg_admin_auth");
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="wrap">
          <div className="hero-logo">
            <img src="/logo.png" alt="Wollaston Gardens" />
          </div>

          <div className="hero-grid">
            <div>
              <h1>Book your food truck for the season.</h1>
              <p className="lead">
                Vendors can request available dates and shifts throughout the season.
                Reservations are only confirmed after admin approval and approved
                bookings automatically appear on the public Seasonal Calendar.
              </p>

              <div className="cta-row">
                <a href="#booking" className="btn btn-primary">
                  Request a Booking
                </a>
              </div>
            </div>

            <SectionCard
              title="Vendor Information"
              subtitle="Important policies for food truck reservations."
            >
              <div className="stack-sm">
                <div className="note-box">
                  <strong>Approval required</strong>
                  <div>
                    Reservations appear on the Seasonal Calendar immediately after
                    admin approval.
                  </div>
                </div>

                <div className="note-box">
                  <strong>Admin notifications</strong>
                  <div>
                    Admin receives text and email notifications for all reservation
                    requests.
                  </div>
                </div>

                <div className="note-box">
                  <strong>Deposit + insurance</strong>
                  <div>
                    Deposit is requested after approval via {DEPOSIT_METHOD}. Insurance
                    is submitted after approval.
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </section>

      <section id="booking" className="section">
        <div className="wrap">
          <div className="tabs">
            <button
              className={activeTab === "vendor" ? "tab active" : "tab"}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor Booking
            </button>
            <button
              className={activeTab === "availability" ? "tab active" : "tab"}
              onClick={() => setActiveTab("availability")}
            >
              Availability
            </button>
          </div>

          {activeTab === "vendor" ? (
            <div className="two-col">
              <SectionCard
                title="Vendor Booking Request"
                subtitle="Choose from all available seasonal time slots. Booking is not confirmed until admin approves it."
              >
                <form className="stack" onSubmit={submitBooking}>
                  <div className="grid-two">
                    <div>
                      <label>Food truck name *</label>
                      <input
                        value={form.truck}
                        onChange={(e) => updateForm("truck", e.target.value)}
                        placeholder="Example: Sunset Tacos"
                      />
                    </div>
                    <div>
                      <label>Contact name *</label>
                      <input
                        value={form.contactName}
                        onChange={(e) =>
                          updateForm("contactName", e.target.value)
                        }
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="grid-two">
                    <div>
                      <label>Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="vendor@email.com"
                      />
                    </div>
                    <div>
                      <label>Phone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="grid-two">
                    <div>
                      <label>Cuisine type *</label>
                      <select
                        value={form.cuisine}
                        onChange={(e) => updateForm("cuisine", e.target.value)}
                      >
                        <option value="">Select cuisine</option>
                        {CUISINE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Preferred location *</label>
                      <select
                        value={form.location}
                        onChange={(e) => updateForm("location", e.target.value)}
                      >
                        <option value="">Select location</option>
                        {LOCATIONS.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-two">
                    <div>
                      <label>Preferred slot *</label>
                      <select
                        value={form.slotId}
                        onChange={(e) => updateForm("slotId", e.target.value)}
                        disabled={!form.location}
                      >
                        <option value="">
                          {form.location
                            ? "Choose an available time slot"
                            : "Select a location first"}
                        </option>
                        {locationFilteredOpenSlots
                          .slice()
                          .sort((a, b) =>
                            `${a.date}${a.startTime}`.localeCompare(
                              `${b.date}${b.startTime}`
                            )
                          )
                          .map((slot) => (
                            <option key={slot.id} value={String(slot.id)}>
                              {slot.displayDate} • {slot.displayTime} •{" "}
                              {slot.slotLabel} • {getPricing(slot)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Truck details / power requirements</label>
                    <textarea
                      value={form.requirements}
                      onChange={(e) =>
                        updateForm("requirements", e.target.value)
                      }
                      placeholder="Tell us about your setup, electrical needs, and any special notes."
                      rows={5}
                    />
                  </div>

                  <div className="info-panel">
                    <div>
                      <strong>Booking rules:</strong> Booking is not confirmed until
                      the admin approves it.
                    </div>
                    <div>
                      <strong>Deposit:</strong> 50% non-refundable deposit due after
                      approval via {DEPOSIT_METHOD}. Refundable only if admin closes
                      the venue due to weather, unforeseen circumstances, admin
                      cancellation, or non-approval.
                    </div>
                    <div>
                      <strong>Operations:</strong> Power will be provided. Generators
                      are not to be used during opening hours unless necessary.
                    </div>
                    <div>
                      <strong>Insurance:</strong> Proof of insurance is required after
                      approval and deposit payment, and must be provided within 48
                      hours or the reservation may be cancelled.
                    </div>
                    <div>
                      <strong>Vendor mix:</strong> Vendor mix is reviewed manually by
                      admin.
                    </div>
                  </div>

                  <div className="note-box">
                    <div className="strong-row">Vendor contract preview</div>
                    <p>
                      Vendor agrees to operate only during approved hours, comply with
                      venue rules, submit required insurance, avoid unauthorized
                      generator use, and report sales accurately for percentage rent.
                    </p>

                    <label className="check">
                      <input
                        type="checkbox"
                        checked={form.acceptedContract}
                        onChange={(e) =>
                          updateForm("acceptedContract", e.target.checked)
                        }
                      />
                      <span>I reviewed and accept the contract terms.</span>
                    </label>

                    <label className="check">
                      <input
                        type="checkbox"
                        checked={form.insuranceAcknowledged}
                        onChange={(e) =>
                          updateForm(
                            "insuranceAcknowledged",
                            e.target.checked
                          )
                        }
                      />
                      <span>
                        I understand proof of insurance is required within 48 hours
                        after approval and deposit payment.
                      </span>
                    </label>
                  </div>

                  <button className="btn btn-danger" type="submit">
                    Submit Booking Request
                  </button>

                  {message ? (
                    <div className="alert alert-warn">{message}</div>
                  ) : null}
                </form>
              </SectionCard>

              <div className="stack">
                <SectionCard
                  title="Booking Policies"
                  subtitle="Key information vendors need before requesting a reservation."
                >
                  <div className="stack-sm">
                    <div className="note-box">
                      <strong>Pricing</strong>
                      <div>
                        Pricing varies by season, shift length, and full-day
                        reservations.
                      </div>
                    </div>
                    <div className="note-box">
                      <strong>Full-day priority</strong>
                      <div>
                        Saturday and Sunday full-day requests have priority over split
                        shifts when approved by admin.
                      </div>
                    </div>
                    <div className="note-box">
                      <strong>Utilities</strong>
                      <div>
                        Power is provided by the venue. Generators should only be used
                        when necessary.
                      </div>
                    </div>
                    <div className="note-box">
                      <strong>Approval + insurance</strong>
                      <div>
                        Admin approval is required before public listing. Insurance
                        proof is required after approval and deposit payment.
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div id="insurance-upload">
                  <SectionCard
                    title="Upload Insurance"
                    subtitle="Approved vendors can upload proof of insurance here using the link from their approval email."
                  >
                    <form className="stack" onSubmit={handleInsuranceUpload}>
                      <div>
                        <label>Booking ID *</label>
                        <input
                          value={insuranceBookingId}
                          onChange={(e) => setInsuranceBookingId(e.target.value)}
                          placeholder="Enter booking ID from your approval link"
                        />
                      </div>

                      <div>
                        <label>Vendor email *</label>
                        <input
                          type="email"
                          value={insuranceEmail}
                          onChange={(e) => setInsuranceEmail(e.target.value)}
                          placeholder="Enter the same email used for booking"
                        />
                      </div>

                      <div>
                        <label>Insurance file *</label>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) =>
                            setInsuranceFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>

                      <button className="btn btn-primary" type="submit">
                        Upload Insurance
                      </button>

                      {insuranceMessage ? (
                        <div className="alert alert-warn">{insuranceMessage}</div>
                      ) : null}
                    </form>
                  </SectionCard>
                </div>
              </div>
            </div>
          ) : (
            <div className="availability-layout">
              <SectionCard
                title="Season Availability Calendar"
                subtitle="Choose a date first. Then select a shift and location."
              >
                <div className="calendar-toolbar">
                  <div>
                    <label>Month</label>
                    <select
                      value={availabilityMonth}
                      onChange={(e) => setAvailabilityMonth(e.target.value)}
                    >
                      <option value="2026-05">May 2026</option>
                      <option value="2026-06">June 2026</option>
                      <option value="2026-07">July 2026</option>
                      <option value="2026-08">August 2026</option>
                      <option value="2026-09">September 2026</option>
                      <option value="2026-10">October 2026</option>
                    </select>
                  </div>

                  <div className="calendar-legend">
                    <span className="legend-dot legend-open"></span>
                    <span>Has availability</span>
                  </div>
                </div>

                <div className="month-grid">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="month-head">
                      {day}
                    </div>
                  ))}

                  {availabilityMonthDates.map((dateCell, index) => {
                    if (!dateCell) {
                      return <div key={`empty-${index}`} className="month-cell empty-cell"></div>;
                    }

                    const dayNumber = Number(dateCell.split("-")[2]);
                    const hasAvailability = datesWithAvailability.has(dateCell);
                    const isSelected = selectedDate === dateCell;

                    return (
                      <button
                        key={dateCell}
                        type="button"
                        className={`month-cell ${hasAvailability ? "has-availability" : "no-availability"} ${isSelected ? "selected-day" : ""}`}
                        onClick={() => hasAvailability && setSelectedDate(dateCell)}
                        disabled={!hasAvailability}
                      >
                        <div className="month-day-number">{dayNumber}</div>
                        {hasAvailability ? (
                          <div className="month-day-note">Open</div>
                        ) : (
                          <div className="month-day-note muted-note">No slots</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard
                title={
                  selectedDate
                    ? `Available Shifts for ${selectedDateSlots[0]?.displayDate || selectedDate}`
                    : "Choose a Date"
                }
                subtitle={
                  selectedDate
                    ? "Select a shift first, then choose one of the available locations."
                    : "Click a date on the calendar to view availability."
                }
              >
                {!selectedDate ? (
                  <div className="empty">
                    Select a highlighted date to see available lunch, dinner, and full-day options.
                  </div>
                ) : selectedDateGroupedBySlot.length === 0 ? (
                  <div className="empty">No open shifts remain for this date.</div>
                ) : (
                  <div className="stack">
                    {selectedDateGroupedBySlot.map((group) => (
                      <div key={`${group.displayTime}-${group.slotLabel}`} className="shift-group-card">
                        <div className="shift-group-header">
                          <div>
                            <div className="calendar-name">{group.slotLabel}</div>
                            <div className="subtle">
                              {group.displayTime} • {getPricing(group.locations[0])}
                            </div>
                          </div>
                          <span className="badge badge-open">
                            {group.locations.length} location{group.locations.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="location-chip-row">
                          {group.locations.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              className="location-chip"
                              onClick={() => selectAvailabilitySlot(slot)}
                            >
                              {slot.location}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          )}
        </div>
      </section>

      <section id="calendar" className="section section-light">
        <div className="wrap two-col">
          <div>
            <h2>Seasonal Calendar</h2>
            <p>
              Visitors can see approved vendors, cuisine types, and reserved shifts
              for the season.
            </p>

            <div className="search-wrap">
              <label>Search calendar</label>
              <input
                value={calendarSearch}
                onChange={(e) => setCalendarSearch(e.target.value)}
                placeholder="Search by vendor, cuisine, shift, date, or location"
              />
            </div>

            <div className="stack">
              {publicCalendar.length === 0 ? (
                <div className="empty">
                  No approved public events match your search.
                </div>
              ) : (
                publicCalendar.map((event) => (
                  <div key={event.id} className="calendar-item">
                    <div>
                      <div className="subtle">{event.displayDate}</div>
                      <div className="calendar-name">{event.truck}</div>
                      <div className="subtle">
                        {event.cuisine} • {event.slotLabel} • {event.location}
                      </div>
                    </div>
                    <div className="calendar-time">{event.displayTime}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <SectionCard
            title="Season Overview"
            subtitle="Reservation highlights and public-facing rules."
          >
            <div className="stack-sm">
              <div className="note-box">
                <strong>Approval required</strong>
                <div>
                  Reservations appear on the Seasonal Calendar immediately after
                  admin approval.
                </div>
              </div>
              <div className="note-box">
                <strong>Admin notifications</strong>
                <div>
                  Admin receives text and email notifications for all reservation
                  requests.
                </div>
              </div>
              <div className="note-box">
                <strong>Post-approval tracking</strong>
                <div>
                  Admin can request deposit, mark deposit received, mark insurance
                  received, and cancel reservations at any time.
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="admin" className="section">
        <div className="wrap two-col">
          {!isAdmin ? (
            <SectionCard
              title="Admin Login"
              subtitle="Authorized access only."
            >
              <div className="stack" style={{ maxWidth: 420 }}>
                <div>
                  <label>Email</label>
                  <input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleAdminLogin}>
                  Login
                </button>

                {loginError ? (
                  <div className="alert alert-warn">{loginError}</div>
                ) : null}
              </div>
            </SectionCard>
          ) : (
            <>
              <SectionCard
                title="Admin Controls"
                subtitle="Secure admin access and calendar export."
              >
                <div className="stack">
                  <div className="button-grid">
                    <button
                      className="btn btn-secondary"
                      onClick={() => downloadICS(approvedSlots)}
                    >
                      Export ICS Feed
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>

                  <div className="metrics">
                    <Metric label="Approved requests" value={approvedSlots.length} />
                    <Metric label="Pending requests" value={pendingSlots.length} />
                    <Metric label="Available time slots" value={openSlots.length} />
                  </div>

                  <div className="note-box">
                    Admin receives text and email notifications for all reservation
                    requests. Vendors are added to the public calendar immediately after
                    admin approval. Admin can request deposit payment, mark deposit
                    received, mark insurance received, and cancel any reservation at
                    their discretion.
                  </div>

                  <div className="note-box">
                    Admin contact: {ADMIN_EMAIL} • {ADMIN_PHONE}
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Admin Approval Dashboard"
                subtitle="Review pending requests, enforce full-day priority, manage approved reservations, and control public calendar syndication."
              >
                <div className="stack">
                  <div>
                    <h4>Pending Requests</h4>

                    {pendingSlots.length === 0 ? (
                      <div className="empty">No pending requests at the moment.</div>
                    ) : (
                      <div className="stack">
                        {pendingSlots.map((slot) => {
                          const relatedIds = getRelatedSlotIds(slot, slots);
                          const conflicts = slots.filter(
                            (candidate) =>
                              relatedIds.includes(candidate.id) &&
                              candidate.id !== slot.id &&
                              ["pending", "approved"].includes(candidate.status)
                          );

                          return (
                            <div key={slot.id} className="admin-card">
                              <div className="admin-main">
                                <div className="calendar-name">{slot.truck}</div>
                                <div className="subtle">
                                  {slot.displayDate} • {slot.location} •{" "}
                                  {slot.displayTime} • {slot.slotLabel}
                                </div>

                                <div className="admin-grid">
                                  <div>{slot.email}</div>
                                  <div>{slot.phone || "No phone provided"}</div>
                                  <div>{slot.cuisine || "Cuisine not specified"}</div>
                                  <div>{slot.location}</div>
                                  <div>{slot.requirements || "No setup notes"}</div>
                                  <div>{getPricing(slot)}</div>
                                  <div>{getDepositText(slot)}</div>
                                </div>

                                {conflicts.length > 0 ? (
                                  <div className="alert alert-warn">
                                    <strong>Conflict notice:</strong> This request
                                    conflicts with {conflicts.length} split/full-day
                                    request(s). Full-day approvals take priority.
                                  </div>
                                ) : null}
                              </div>

                              <div className="admin-actions">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => approveSlot(slot.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => declineSlot(slot.id)}
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4>Approved Reservations</h4>

                    {approvedSlots.length === 0 ? (
                      <div className="empty">No approved reservations yet.</div>
                    ) : (
                      <div className="stack">
                        {approvedSlots.map((slot) => (
                          <div key={slot.id} className="admin-card">
                            <div className="admin-main">
                              <div className="calendar-name">{slot.truck}</div>
                              <div className="subtle">
                                {slot.displayDate} • {slot.location} •{" "}
                                {slot.displayTime} • {slot.slotLabel}
                              </div>

                              <div className="admin-grid">
                                <div>{slot.cuisine || "Cuisine not specified"}</div>
                                <div>{slot.location}</div>
                                <div>{getPricing(slot)}</div>
                                <div>{slot.email}</div>
                                <div>{slot.phone || "No phone provided"}</div>
                                <div>
                                  Deposit requested:{" "}
                                  {slot.depositRequested ? "Yes" : "No"}
                                </div>
                                <div>
                                  Deposit received:{" "}
                                  {slot.depositReceived ? "Yes" : "No"}
                                </div>
                                <div>
                                  Insurance uploaded:{" "}
                                  {slot.insuranceUploaded ? "Yes" : "No"}
                                </div>
                                <div>
                                  Insurance received:{" "}
                                  {slot.insuranceReceived ? "Yes" : "No"}
                                </div>
                                <div>
                                  File: {slot.insuranceFileName || "None"}
                                </div>
                                <div>
                                  Cancel reason: {slot.cancelReason || "None"}
                                </div>
                              </div>
                            </div>

                            <div className="admin-actions">
                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  toggleApprovedFlag(slot.id, "depositRequested")
                                }
                              >
                                {slot.depositRequested
                                  ? "Deposit Requested"
                                  : "Request Deposit"}
                              </button>

                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  toggleApprovedFlag(slot.id, "depositReceived")
                                }
                              >
                                {slot.depositReceived
                                  ? "Deposit Received"
                                  : "Mark Deposit Received"}
                              </button>

                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  toggleApprovedFlag(slot.id, "insuranceReceived")
                                }
                              >
                                {slot.insuranceReceived
                                  ? "Insurance Received"
                                  : "Mark Insurance Received"}
                              </button>

                              {slot.insuranceUploaded ? (
                                <button
                                  className="btn btn-secondary"
                                  onClick={() =>
                                    window.open(
                                      `/.netlify/functions/insurance-download?bookingId=${slot.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  Download Insurance
                                </button>
                              ) : null}

                              <button
                                className="btn btn-danger"
                                onClick={() => cancelReservation(slot.id)}
                              >
                                Cancel Reservation
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

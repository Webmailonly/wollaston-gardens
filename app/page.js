"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wollaston-gardens-preview-v1";
const ADMIN_PASSWORD = "venueadmin";
const VENUE_NAME = "Wollaston Gardens";
const ADMIN_EMAIL = "info@thewollastongardens.com";
const ADMIN_PHONE = "617 903 0736";
const DEPOSIT_METHOD = "Stripe";

const CUISINE_OPTIONS = [
  "American","Brazilian","Chinese","Asian Fusion","Indian","Middle Eastern",
  "Irish","German","French","Greek","Italian","Mexican","Jamaican","Caribbean",
  "BBQ","Pizza","Pasta","Sushi","Dessert","Pastry"
];

const SIMILAR_CUISINE_GROUPS = {
  American: "american-bbq",
  BBQ: "american-bbq",
  Italian: "italian-pizza-pasta",
  Pizza: "italian-pizza-pasta",
  Pasta: "italian-pizza-pasta",
  Chinese: "asian",
  "Asian Fusion": "asian",
  Sushi: "asian",
  Indian: "indian",
  "Middle Eastern": "mediterranean",
  Greek: "mediterranean",
  Mexican: "latin",
  Brazilian: "latin",
  Jamaican: "caribbean",
  Caribbean: "caribbean",
  Irish: "european",
  German: "european",
  French: "european",
  Dessert: "dessert-pastry",
  Pastry: "dessert-pastry",
};

const SCHEDULE_ROWS = [
  ["2026-05-15", "Friday"], ["2026-05-16", "Saturday"], ["2026-05-17", "Sunday"],
  ["2026-05-21", "Thursday"], ["2026-05-22", "Friday"], ["2026-05-23", "Saturday"], ["2026-05-24", "Sunday"],
  ["2026-05-28", "Thursday"], ["2026-05-29", "Friday"], ["2026-05-30", "Saturday"], ["2026-05-31", "Sunday"],
  ["2026-06-04", "Thursday"], ["2026-06-05", "Friday"], ["2026-06-06", "Saturday"], ["2026-06-07", "Sunday"],
  ["2026-06-11", "Thursday"], ["2026-06-12", "Friday"], ["2026-06-13", "Saturday"], ["2026-06-14", "Sunday"],
  ["2026-06-18", "Thursday"], ["2026-06-19", "Friday"], ["2026-06-20", "Saturday"], ["2026-06-21", "Sunday"],
  ["2026-06-25", "Thursday"], ["2026-06-26", "Friday"], ["2026-06-27", "Saturday"], ["2026-06-28", "Sunday"],
  ["2026-07-02", "Thursday"], ["2026-07-03", "Friday"], ["2026-07-04", "Saturday"], ["2026-07-05", "Sunday"],
  ["2026-07-09", "Thursday"], ["2026-07-10", "Friday"], ["2026-07-11", "Saturday"], ["2026-07-12", "Sunday"],
  ["2026-07-16", "Thursday"], ["2026-07-17", "Friday"], ["2026-07-18", "Saturday"], ["2026-07-19", "Sunday"],
  ["2026-07-23", "Thursday"], ["2026-07-24", "Friday"], ["2026-07-25", "Saturday"], ["2026-07-26", "Sunday"],
  ["2026-07-30", "Thursday"], ["2026-07-31", "Friday"], ["2026-08-01", "Saturday"], ["2026-08-02", "Sunday"],
  ["2026-08-06", "Thursday"], ["2026-08-07", "Friday"], ["2026-08-08", "Saturday"], ["2026-08-09", "Sunday"],
  ["2026-08-13", "Thursday"], ["2026-08-14", "Friday"], ["2026-08-15", "Saturday"], ["2026-08-16", "Sunday"],
  ["2026-08-20", "Thursday"], ["2026-08-21", "Friday"], ["2026-08-22", "Saturday"], ["2026-08-23", "Sunday"],
  ["2026-08-27", "Thursday"], ["2026-08-28", "Friday"], ["2026-08-29", "Saturday"], ["2026-08-30", "Sunday"],
  ["2026-09-03", "Thursday"], ["2026-09-04", "Friday"], ["2026-09-05", "Saturday"], ["2026-09-06", "Sunday"],
  ["2026-09-10", "Thursday"], ["2026-09-11", "Friday"], ["2026-09-12", "Saturday"], ["2026-09-13", "Sunday"],
  ["2026-09-17", "Thursday"], ["2026-09-18", "Friday"], ["2026-09-19", "Saturday"], ["2026-09-20", "Sunday"],
  ["2026-09-24", "Thursday"], ["2026-09-25", "Friday"], ["2026-09-26", "Saturday"], ["2026-09-27", "Sunday"],
  ["2026-10-01", "Thursday"], ["2026-10-02", "Friday"], ["2026-10-03", "Saturday"], ["2026-10-04", "Sunday"],
  ["2026-10-08", "Thursday"], ["2026-10-09", "Friday"], ["2026-10-10", "Saturday"], ["2026-10-11", "Sunday"],
  ["2026-10-15", "Thursday"], ["2026-10-16", "Friday"], ["2026-10-17", "Saturday"],
];

const emptyForm = {
  truck: "",
  contactName: "",
  email: "",
  phone: "",
  cuisine: "",
  requirements: "",
  slotId: "",
  acceptedContract: false,
  insuranceAcknowledged: false,
};

function saveState(state) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getMonthName(monthIndex) {
  return [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ][monthIndex];
}

function getSeasonWindow(date) {
  if (date >= "2026-05-15" && date <= "2026-06-30") return "may-june";
  if (date >= "2026-07-01" && date < "2026-08-15") return "july-aug14";
  return "aug15-oct15";
}

function getCuisineGroup(cuisine) {
  return SIMILAR_CUISINE_GROUPS[cuisine] || String(cuisine || "").toLowerCase() || "other";
}

function getPricing(slot) {
  if (slot.date === "2026-10-03" || slot.date === "2026-10-04") return "$250 + 10% of sales";
  const season = getSeasonWindow(slot.date);
  if (slot.slotKind === "full-day") return season === "july-aug14" ? "$175 + 10% of sales" : "$225 + 10% of sales";
  if (slot.durationHours === 3) return season === "july-aug14" ? "$125 + 12% of sales" : "$150 + 10% of sales";
  if (slot.durationHours === 4 || slot.durationHours === 5) return season === "july-aug14" ? "$125 + 10% of sales" : "$175 + 10% of sales";
  return "$150 + 10% of sales";
}

function getDepositText(slot) {
  return `50% deposit due after approval via ${DEPOSIT_METHOD}. Rate: ${getPricing(slot)}`;
}

function createSlotsFromSchedule() {
  let id = 1;
  const slots = [];
  for (const [date, day] of SCHEDULE_ROWS) {
    const [year, month, dayNumber] = date.split("-").map(Number);
    const displayDate = `${getMonthName(month - 1)} ${dayNumber}, ${year}`;
    const base = {
      date,
      displayDate,
      day,
      status: "open",
      venueArea: VENUE_NAME,
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
    const pushSlot = (extra) => slots.push({ ...base, id: id++, ...extra });
    if (day === "Thursday" || day === "Friday") {
      pushSlot({ startTime: "16:00", endTime: "21:00", displayTime: "4:00 PM - 9:00 PM", category: "Dinner", slotKind: "standard", slotLabel: "Dinner Shift", durationHours: 5 });
      continue;
    }
    if (day === "Saturday") {
      pushSlot({ startTime: "12:00", endTime: "15:00", displayTime: "12:00 PM - 3:00 PM", category: "Lunch", slotKind: "partial", slotLabel: "Lunch Shift", durationHours: 3 });
      pushSlot({ startTime: "16:00", endTime: "21:00", displayTime: "4:00 PM - 9:00 PM", category: "Dinner", slotKind: "partial", slotLabel: "Dinner Shift", durationHours: 5 });
      pushSlot({ startTime: "12:00", endTime: "21:00", displayTime: "12:00 PM - 9:00 PM", category: "Full Day", slotKind: "full-day", slotLabel: "Full Day", durationHours: 9, priorityTier: "priority" });
      continue;
    }
    if (day === "Sunday") {
      pushSlot({ startTime: "12:00", endTime: "15:00", displayTime: "12:00 PM - 3:00 PM", category: "Lunch", slotKind: "partial", slotLabel: "Midday Shift", durationHours: 3 });
      pushSlot({ startTime: "16:00", endTime: "19:00", displayTime: "4:00 PM - 7:00 PM", category: "Dinner", slotKind: "partial", slotLabel: "Evening Shift", durationHours: 3 });
      pushSlot({ startTime: "12:00", endTime: "19:00", displayTime: "12:00 PM - 7:00 PM", category: "Full Day", slotKind: "full-day", slotLabel: "Full Day", durationHours: 7, priorityTier: "priority" });
    }
  }
  return slots;
}

const initialSlots = createSlotsFromSchedule();

function getRelatedSlotIds(slot, allSlots) {
  if (!slot || !["Saturday", "Sunday"].includes(slot.day)) return slot ? [slot.id] : [];
  return allSlots.filter((candidate) => candidate.date === slot.date).map((candidate) => candidate.id);
}

function isSlotBlockedByDateConflict(slot, allSlots) {
  const relatedIds = getRelatedSlotIds(slot, allSlots);
  return allSlots.some((candidate) => relatedIds.includes(candidate.id) && candidate.id !== slot.id && ["pending", "approved"].includes(candidate.status));
}

function isCuisineConflict(selectedSlot, selectedCuisine, allSlots) {
  const group = getCuisineGroup(selectedCuisine);
  return allSlots.some((slot) => slot.date === selectedSlot.date && ["pending", "approved"].includes(slot.status) && getCuisineGroup(slot.cuisine) === group);
}

function slotOptionLabel(slot) {
  return `${slot.displayDate} • ${slot.displayTime} • ${slot.slotLabel} • ${getPricing(slot)}`;
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

export default function Page() {
  const [slots, setSlots] = useState(initialSlots);
  const [form, setForm] = useState(emptyForm);
  const [slotFilter, setSlotFilter] = useState("all");
  const [calendarSearch, setCalendarSearch] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("vendor");

  useEffect(() => {
    const saved = loadState();
    if (saved?.slots) setSlots(saved.slots);
  }, []);

  useEffect(() => {
    saveState({ slots });
  }, [slots]);

  useEffect(() => {
    if (selectedSlotId) setForm((prev) => ({ ...prev, slotId: String(selectedSlotId) }));
  }, [selectedSlotId]);

  const openSlots = useMemo(() => slots.filter((slot) => slot.status === "open" && !isSlotBlockedByDateConflict(slot, slots)), [slots]);
  const pendingSlots = useMemo(() => slots.filter((slot) => slot.status === "pending"), [slots]);
  const approvedSlots = useMemo(() => slots.filter((slot) => slot.status === "approved"), [slots]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (slotFilter === "all") return true;
      if (slotFilter === "available") return slot.status === "open" && !isSlotBlockedByDateConflict(slot, slots);
      if (slotFilter === "booked") return slot.status === "approved";
      if (slotFilter === "full-day") return slot.slotKind === "full-day";
      return String(slot.category).toLowerCase() === slotFilter;
    });
  }, [slots, slotFilter]);

  const publicCalendar = useMemo(() => {
    return approvedSlots
      .filter((slot) => {
        const q = calendarSearch.toLowerCase();
        return !q || String(slot.truck || "").toLowerCase().includes(q) || slot.displayDate.toLowerCase().includes(q) || String(slot.cuisine || "").toLowerCase().includes(q) || String(slot.slotLabel || "").toLowerCase().includes(q);
      })
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  }, [approvedSlots, calendarSearch]);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitBooking(e) {
    e.preventDefault();
    const selectedSlot = slots.find((slot) => String(slot.id) === String(form.slotId));
    if (!selectedSlot || !form.truck || !form.contactName || !form.email || !form.cuisine) {
      setMessage("Please complete all required fields and choose an available slot.");
      return;
    }
    if (!form.acceptedContract) {
      setMessage("Please review and accept the contract terms before submitting.");
      return;
    }
    if (!form.insuranceAcknowledged) {
      setMessage("Please acknowledge the insurance requirement before submitting.");
      return;
    }
    if (isSlotBlockedByDateConflict(selectedSlot, slots)) {
      setMessage("That slot is no longer available because a conflicting split or full-day request already exists.");
      return;
    }
    if (isCuisineConflict(selectedSlot, form.cuisine, slots)) {
      setMessage("A similar cuisine is already pending or approved for that date. Please choose another date or cuisine window.");
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
      await fetch("/.netlify/functions/send-booking-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
          displayTime: selectedSlot.displayTime
        })
      });

      setMessage(`Booking request submitted. Email notifications sent to ${ADMIN_EMAIL} and ${form.email}.`);
    } catch (error) {
      setMessage("Booking request saved, but email sending failed.");
    }

    setForm(emptyForm);
    setSelectedSlotId("");
  }

  function approveSlot(slotId) {
    const selected = slots.find((slot) => slot.id === slotId);
    if (!selected) return;
    const relatedIds = getRelatedSlotIds(selected, slots);
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: "approved",
            notificationState: "sent",
            depositRequested: true,
          };
        }
        if (relatedIds.includes(slot.id) && slot.id !== slotId && slot.status === "pending" && selected.slotKind === "full-day") {
          return { ...slot, status: "declined", adminNotes: "Declined due to approved full-day priority booking." };
        }
        return slot;
      })
    );
    setMessage(`Booking approved. It appears on the Seasonal Calendar immediately. Deposit request via ${DEPOSIT_METHOD} and insurance follow-up are now due.`);
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
          cancelReason: "",
          adminNotes: "",
          notificationState: "not-sent",
        };
      })
    );
    setMessage("Booking request declined and slot reopened.");
  }

  function cancelReservation(slotId) {
    const reason = window.prompt("Enter cancellation reason:", "Cancelled by admin") || "Cancelled by admin";
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
          cancelReason: reason,
          adminNotes: reason,
          notificationState: "not-sent",
        };
      })
    );
    setMessage(`Reservation cancelled by admin and removed from the Seasonal Calendar. Reason: ${reason}`);
  }

  function toggleApprovedFlag(slotId, field) {
    setSlots((prev) => prev.map((slot) => (slot.id !== slotId ? slot : { ...slot, [field]: !slot[field] })));
  }

  function clearDemoData() {
    setSlots(initialSlots);
    setForm(emptyForm);
    setSelectedSlotId("");
    setMessage("Demo data reset.");
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }

  function toggleAdminMode(nextChecked) {
    if (!nextChecked) {
      setAdminMode(false);
      setAdminAuthError("");
      return;
    }
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminMode(true);
      setAdminAuthError("");
      return;
    }
    setAdminMode(false);
    setAdminAuthError("Incorrect password for preview admin mode.");
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Vendor Booking + Seasonal Calendar</div>
            <h1>Book your food truck for the season.</h1>
            <p className="lead">
              Vendors can request available dates and shifts throughout the season. Reservations are only confirmed after admin approval and approved bookings automatically appear on the public Seasonal Calendar.
            </p>
            <div className="cta-row">
              <a href="#booking" className="btn btn-primary">Request a Booking</a>
              <a href="#calendar" className="btn btn-secondary">View Seasonal Calendar</a>
            </div>
            <div className="metrics">
              <Metric label="Approved bookings" value={approvedSlots.length} />
              <Metric label="Pending requests" value={pendingSlots.length} />
              <Metric label="Open time slots" value={openSlots.length} />
            </div>
          </div>

          <SectionCard title="Vendor Information" subtitle="Important policies for food truck reservations.">
            <div className="stack-sm">
              <div className="note-box"><strong>Approval required</strong><div>Reservations appear on the Seasonal Calendar immediately after admin approval.</div></div>
              <div className="note-box"><strong>Admin notifications</strong><div>Admin receives text and email notifications for all reservation requests.</div></div>
              <div className="note-box"><strong>Deposit + insurance</strong><div>Deposit is requested after approval via {DEPOSIT_METHOD}. Insurance is submitted after approval.</div></div>
              <div className="note-box"><strong>Special rate dates</strong><div>October 3 and 4 (October Fest): $250 + 10% of sales.</div></div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="booking" className="section">
        <div className="wrap">
          <div className="tabs">
            <button className={activeTab === "vendor" ? "tab active" : "tab"} onClick={() => setActiveTab("vendor")}>Vendor Booking</button>
            <button className={activeTab === "availability" ? "tab active" : "tab"} onClick={() => setActiveTab("availability")}>Availability</button>
          </div>

          {activeTab === "vendor" ? (
            <div className="two-col">
              <SectionCard title="Vendor Booking Request" subtitle="Choose from all available seasonal time slots. Booking is not confirmed until admin approves it.">
                <form className="stack" onSubmit={submitBooking}>
                  <div className="grid-two">
                    <div><label>Food truck name *</label><input value={form.truck} onChange={(e) => updateForm("truck", e.target.value)} placeholder="Example: Sunset Tacos" /></div>
                    <div><label>Contact name *</label><input value={form.contactName} onChange={(e) => updateForm("contactName", e.target.value)} placeholder="Your full name" /></div>
                  </div>

                  <div className="grid-two">
                    <div><label>Email *</label><input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="vendor@email.com" /></div>
                    <div><label>Phone</label><input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="(555) 555-5555" /></div>
                  </div>

                  <div className="grid-two">
                    <div>
                      <label>Cuisine type *</label>
                      <select value={form.cuisine} onChange={(e) => updateForm("cuisine", e.target.value)}>
                        <option value="">Select cuisine</option>
                        {CUISINE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Preferred slot *</label>
                      <select value={form.slotId} onChange={(e) => updateForm("slotId", e.target.value)}>
                        <option value="">Choose any available time slot</option>
                        {openSlots.slice().sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)).map((slot) => (
                          <option key={slot.id} value={String(slot.id)}>{slotOptionLabel(slot)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Truck details / power requirements</label>
                    <textarea value={form.requirements} onChange={(e) => updateForm("requirements", e.target.value)} placeholder="Tell us about your setup, electrical needs, and any special notes." rows={5} />
                  </div>

                  <div className="info-panel">
                    <div><strong>Booking rules:</strong> Booking is not confirmed until the admin approves it.</div>
                    <div><strong>Deposit:</strong> 50% non-refundable deposit due after approval via {DEPOSIT_METHOD}. Refundable only if admin closes the venue due to weather, unforeseen circumstances, admin cancellation, or non-approval.</div>
                    <div><strong>Operations:</strong> Power will be provided. Generators are not to be used during opening hours unless necessary.</div>
                    <div><strong>Insurance:</strong> Proof of insurance is required after approval and deposit payment, and must be provided within 48 hours or the reservation may be cancelled.</div>
                    <div><strong>Cuisine protection:</strong> Similar cuisines cannot reserve similar time windows.</div>
                  </div>

                  <div className="note-box">
                    <div className="strong-row">Vendor contract preview</div>
                    <p>Vendor agrees to operate only during approved hours, comply with venue rules, submit required insurance, avoid unauthorized generator use, and report sales accurately for percentage rent.</p>
                    <label className="check"><input type="checkbox" checked={form.acceptedContract} onChange={(e) => updateForm("acceptedContract", e.target.checked)} /> <span>I reviewed and accept the contract terms.</span></label>
                    <label className="check"><input type="checkbox" checked={form.insuranceAcknowledged} onChange={(e) => updateForm("insuranceAcknowledged", e.target.checked)} /> <span>I understand proof of insurance is required within 48 hours after approval and deposit payment.</span></label>
                  </div>

                  <button className="btn btn-danger" type="submit">Submit Booking Request</button>
                </form>
              </SectionCard>

              <SectionCard title="Booking Policies" subtitle="Key information vendors need before requesting a reservation.">
                <div className="stack-sm">
                  <div className="note-box"><strong>Pricing</strong><div>Pricing varies by season, shift length, and full-day reservations. October 3 and 4 use a special October Fest rate.</div></div>
                  <div className="note-box"><strong>Full-day priority</strong><div>Saturday and Sunday full-day requests have priority over split shifts when approved by admin.</div></div>
                  <div className="note-box"><strong>Utilities</strong><div>Power is provided by the venue. Generators should only be used when necessary.</div></div>
                  <div className="note-box"><strong>Approval + insurance</strong><div>Admin approval is required before public listing. Insurance proof is required after approval and deposit payment.</div></div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div>
              <div className="bar">
                <div>
                  <h2>Available Seasonal Time Slots</h2>
                  <p>Saturdays and Sundays offer split shifts and full-day options. Full-day bookings take priority when approved.</p>
                </div>
                <div>
                  <label>Filter slots</label>
                  <select value={slotFilter} onChange={(e) => setSlotFilter(e.target.value)}>
                    <option value="all">All slots</option>
                    <option value="available">Available</option>
                    <option value="booked">Approved</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="full-day">Full Day</option>
                  </select>
                </div>
              </div>

              <div className="cards-grid">
                {filteredSlots.map((slot) => {
                  const blocked = slot.status === "open" && isSlotBlockedByDateConflict(slot, slots);
                  return (
                    <div key={slot.id} className="slot-card">
                      <div className="slot-top">
                        <div>
                          <div className="slot-date">{slot.displayDate}</div>
                          <div className="subtle">{slot.day}</div>
                        </div>
                        <span className={`badge ${blocked ? "badge-muted" : `badge-${slot.status}`}`}>{blocked ? "Blocked" : slot.status}</span>
                      </div>
                      <div className="slot-meta">
                        <div>{slot.displayTime}</div>
                        <div>{slot.slotLabel}</div>
                        <div>{slot.venueArea}</div>
                        <div>{getPricing(slot)}</div>
                      </div>
                      <div className="slot-note">
                        {blocked ? "Unavailable because a conflicting split or full-day request is pending or approved."
                          : slot.status === "open" ? "This slot is open for booking requests."
                          : slot.status === "pending" ? `Pending request from ${slot.truck}.`
                          : `Confirmed for ${slot.truck}.`}
                      </div>
                      <button
                        className="btn btn-full"
                        disabled={slot.status !== "open" || blocked}
                        onClick={() => {
                          setSelectedSlotId(String(slot.id));
                          updateForm("slotId", String(slot.id));
                          setActiveTab("vendor");
                          document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {!blocked && slot.status === "open" ? "Request This Slot" : slot.status === "pending" ? "Pending Review" : "Unavailable"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="calendar" className="section section-light">
        <div className="wrap two-col">
          <div>
            <h2>Seasonal Calendar</h2>
            <p>Visitors can see approved vendors, cuisine types, and reserved shifts for the season.</p>
            <div className="search-wrap">
              <label>Search calendar</label>
              <input value={calendarSearch} onChange={(e) => setCalendarSearch(e.target.value)} placeholder="Search by vendor, cuisine, shift, or date" />
            </div>
            <div className="stack">
              {publicCalendar.length === 0 ? (
                <div className="empty">No approved public events match your search.</div>
              ) : publicCalendar.map((event) => (
                <div key={event.id} className="calendar-item">
                  <div>
                    <div className="subtle">{event.displayDate}</div>
                    <div className="calendar-name">{event.truck}</div>
                    <div className="subtle">{event.cuisine} • {event.slotLabel} • {event.venueArea}</div>
                  </div>
                  <div className="calendar-time">{event.displayTime}</div>
                </div>
              ))}
            </div>
          </div>

          <SectionCard title="Season Overview" subtitle="Reservation highlights and public-facing rules.">
            <div className="stack-sm">
              <div className="note-box"><strong>Approval required</strong><div>Reservations appear on the Seasonal Calendar immediately after admin approval.</div></div>
              <div className="note-box"><strong>Admin notifications</strong><div>Admin receives text and email notifications for all reservation requests.</div></div>
              <div className="note-box"><strong>Post-approval tracking</strong><div>Admin can request deposit, mark deposit received, mark insurance received, and cancel reservations at any time.</div></div>
              <div className="note-box"><strong>Special rate dates</strong><div>October 3 and 4 (October Fest): $250 + 10% of sales.</div></div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section id="admin" className="section">
        <div className="wrap two-col">
          <SectionCard title="Admin Controls" subtitle="Preview admin access, calendar export, and demo management.">
            <div className="stack">
              <div className="note-box">
                <div className="admin-toggle">
                  <div>
                    <div className="strong-row">Admin mode</div>
                    <div className="subtle">Requires password in preview mode.</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={adminMode} onChange={(e) => toggleAdminMode(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
                <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} placeholder="Enter admin password" />
              </div>

              <div className="button-grid">
                <button className="btn btn-secondary" onClick={clearDemoData}>Reset Demo Data</button>
                <button className="btn btn-secondary" onClick={() => alert("ICS export is part of the production build path.")}>Export ICS Feed</button>
              </div>

              <div className="note-box">Admin receives text and email notifications for all reservation requests. Vendors are added to the public calendar immediately after admin approval. Admin can request deposit payment, mark deposit received, mark insurance received, and cancel any reservation at their discretion.</div>
              <div className="note-box">Admin contact: {ADMIN_EMAIL} • {ADMIN_PHONE}</div>

              {adminAuthError ? <div className="alert alert-warn">{adminAuthError}</div> : null}
              {message ? <div className="alert alert-ok">{message}</div> : null}
            </div>
          </SectionCard>

          <SectionCard title="Admin Approval Dashboard" subtitle="Review pending requests, enforce full-day priority, manage approved reservations, and control public calendar syndication.">
            {!adminMode ? (
              <div className="empty">Admin mode is locked. Enter the preview password above and enable admin mode to manage reservations.</div>
            ) : (
              <div className="stack">
                <div>
                  <h4>Pending Requests</h4>
                  {pendingSlots.length === 0 ? (
                    <div className="empty">No pending requests at the moment.</div>
                  ) : (
                    <div className="stack">
                      {pendingSlots.map((slot) => {
                        const relatedIds = getRelatedSlotIds(slot, slots);
                        const conflicts = slots.filter((candidate) => relatedIds.includes(candidate.id) && candidate.id !== slot.id && ["pending", "approved"].includes(candidate.status));
                        return (
                          <div key={slot.id} className="admin-card">
                            <div className="admin-main">
                              <div className="calendar-name">{slot.truck}</div>
                              <div className="subtle">{slot.displayDate} • {slot.displayTime} • {slot.slotLabel}</div>
                              <div className="admin-grid">
                                <div>{slot.email}</div>
                                <div>{slot.phone || "No phone provided"}</div>
                                <div>{slot.cuisine || "Cuisine not specified"}</div>
                                <div>{slot.requirements || "No setup notes"}</div>
                                <div>{getPricing(slot)}</div>
                                <div>{getDepositText(slot)}</div>
                              </div>
                              {conflicts.length > 0 ? (
                                <div className="alert alert-warn"><strong>Conflict notice:</strong> This request conflicts with {conflicts.length} split/full-day request(s). Full-day approvals take priority.</div>
                              ) : null}
                            </div>
                            <div className="admin-actions">
                              <button className="btn btn-primary" onClick={() => approveSlot(slot.id)}>Approve</button>
                              <button className="btn btn-secondary" onClick={() => declineSlot(slot.id)}>Decline</button>
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
                            <div className="subtle">{slot.displayDate} • {slot.displayTime} • {slot.slotLabel}</div>
                            <div className="admin-grid">
                              <div>{slot.cuisine || "Cuisine not specified"}</div>
                              <div>{getPricing(slot)}</div>
                              <div>{slot.email}</div>
                              <div>{slot.phone || "No phone provided"}</div>
                              <div>Deposit requested: {slot.depositRequested ? "Yes" : "No"}</div>
                              <div>Deposit received: {slot.depositReceived ? "Yes" : "No"}</div>
                              <div>Insurance received: {slot.insuranceReceived ? "Yes" : "No"}</div>
                              <div>Cancel reason: {slot.cancelReason || "None"}</div>
                            </div>
                          </div>
                          <div className="admin-actions">
                            <button className="btn btn-secondary" onClick={() => toggleApprovedFlag(slot.id, "depositRequested")}>{slot.depositRequested ? "Deposit Requested" : "Request Deposit"}</button>
                            <button className="btn btn-secondary" onClick={() => toggleApprovedFlag(slot.id, "depositReceived")}>{slot.depositReceived ? "Deposit Received" : "Mark Deposit Received"}</button>
                            <button className="btn btn-secondary" onClick={() => toggleApprovedFlag(slot.id, "insuranceReceived")}>{slot.insuranceReceived ? "Insurance Received" : "Mark Insurance Received"}</button>
                            <button className="btn btn-danger" onClick={() => cancelReservation(slot.id)}>Cancel Reservation</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </section>
    </main>
  );
}

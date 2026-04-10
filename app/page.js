"use client";

import { useState } from "react";

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
  });

  function submit(e) {
    e.preventDefault();

    setBookings([
      ...bookings,
      { ...form, status: "pending", id: Date.now() },
    ]);

    setForm({ name: "", cuisine: "" });
  }

  function approve(id) {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: "approved" } : b
      )
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Wollaston Gardens</h1>

      <h2>Book</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <br />
        <input
          placeholder="Cuisine"
          value={form.cuisine}
          onChange={(e) =>
            setForm({ ...form, cuisine: e.target.value })
          }
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      <h2>Admin</h2>
      {bookings
        .filter((b) => b.status === "pending")
        .map((b) => (
          <div key={b.id}>
            {b.name} ({b.cuisine})
            <button onClick={() => approve(b.id)}>
              Approve
            </button>
          </div>
        ))}

      <h2>Calendar</h2>
      {bookings
        .filter((b) => b.status === "approved")
        .map((b) => (
          <div key={b.id}>
            {b.name} - {b.cuisine}
          </div>
        ))}
    </div>
  );
}

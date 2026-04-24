export default function SmsConsentPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Wollaston Gardens SMS Notifications</h1>

      <p>
        Wollaston Gardens uses SMS notifications to communicate with vendors
        regarding booking requests and scheduling updates.
      </p>

      <h3>What you can expect</h3>
      <ul>
        <li>Booking request confirmations</li>
        <li>Booking approvals</li>
        <li>Schedule updates or changes</li>
      </ul>

      <p>
        By submitting a booking request and providing your phone number, you
        consent to receive SMS messages from Wollaston Gardens related to your
        booking.
      </p>

      <p>
        Message frequency varies. Message and data rates may apply. You can opt
        out at any time by replying STOP.
      </p>

      <p>
        For questions, contact us at{" "}
        <a href="mailto:info@thewollastongardens.com">
          info@thewollastongardens.com
        </a>
      </p>
    </div>
  );
}
